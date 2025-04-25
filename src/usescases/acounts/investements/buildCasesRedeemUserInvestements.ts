import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

function parseDatabaseNumber(value: any): number {
    if (value === undefined || value === null) {
        throw new Error("Valor numérico es undefined o null");
    }
    if (typeof value === 'number') return value;

    const stringValue = String(value).trim();
    const normalizedValue = stringValue.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(normalizedValue);

    if (isNaN(parsed)) {
        throw new Error(`Valor numérico inválido: ${stringValue}`);
    }

    return parsed;
}

async function validateAndParseInvestment(services: any, userId: string, investmentId: string, amount?: any) {
    if (!investmentId) {
        throw { status: 400, message: "ID de inversión requerido", code: 10 };
    }
    
    const investment = await services.investments.getUserInvestment(userId, investmentId);

    if (!investment?.dataValues) {
        throw { status: 404, message: "Inversión no encontrada", code: 2 };
    }

    const {
        CURRENT_VALUE: dbCurrentValue,
        CRYPTO_AMOUNT: dbCryptoAmount,
        INIT_VALUE: dbInitValue,
        currentCryptoPrice: dbCryptoPrice,
        ASSET
    } = investment.dataValues;

    const currentValue = parseDatabaseNumber(dbCurrentValue);
    const cryptoAmount = parseDatabaseNumber(dbCryptoAmount);
    const initialValue = parseDatabaseNumber(dbInitValue);
    const cryptoPrice = parseDatabaseNumber(dbCryptoPrice);
    const redeemAmount = amount ? parseDatabaseNumber(amount) : currentValue;

    if (redeemAmount <= 0 || redeemAmount > currentValue) {
        throw { status: 400, message: "Monto inválido", code: 9 };
    }

    return {
        investment,
        investmentId,
        userId,
        asset: ASSET,
        currentValue,
        initialValue, // Aseguramos que tenemos el valor inicial
        cryptoAmount,
        cryptoPrice,
        redeemAmount
    };
}

async function executePartialRedemption(services: any, params: any, t: any) {
    const { investmentId, currentValue, initialValue, cryptoAmount, redeemAmount } = params;

    // Calcular la proporción que se está redimiendo
    const redemptionRatio = redeemAmount / currentValue;
    const remainingRatio = 1 - redemptionRatio;

    // Calcular nuevos valores
    const cryptoToRedeem = cryptoAmount * redemptionRatio;
    const newCurrentValue = currentValue - redeemAmount;
    const newCryptoAmount = cryptoAmount - cryptoToRedeem;
    const newInitialValue = initialValue * remainingRatio; // Ajustamos el valor inicial proporcionalmente

    await services.investments.updateInvestment(
        investmentId,
        {
            CURRENT_VALUE: parseFloat(newCurrentValue.toFixed(2)),
            CRYPTO_AMOUNT: parseFloat(newCryptoAmount.toFixed(8)),
            INIT_VALUE: parseFloat(newInitialValue.toFixed(2)) // Actualizamos el INIT_VALUE
        },
        { transaction: t }
    );

    return {
        cryptoToRedeem,
        newCurrentValue,
        newCryptoAmount,
        newInitialValue
    };
}

async function executeFullRedemption(services: any, params: any, t: any) {
    const { investmentId, userId, redeemAmount, asset, cryptoAmount } = params;

    await services.transactions.create({
        USER_ID: userId,
        INVESTMENT_ID: investmentId,
        TYPE: "REDEMPTION",
        AMOUNT: redeemAmount,
        CRYPTO_AMOUNT: cryptoAmount,
        ASSET: asset,
        CREATED_AT: new Date()
    }, { transaction: t });

    await services.investments.deleteInvestment(investmentId, { transaction: t });

    return true;
}

async function executeRedemption(services: any, params: any, log: Logger) {
    const {
        investment,
        investmentId,
        userId,
        asset,
        currentValue,
        initialValue,
        cryptoAmount,
        redeemAmount
    } = params;

    const isFullRedemption = Math.abs(redeemAmount - currentValue) < 0.01; // Margen de 1 céntimo

    try {
        const transactionResult = await services.transactions.executeAtomic(async (t: any) => {
            let result = {
                cryptoToRedeem: cryptoAmount,
                newInitialValue: 0
            };

            if (isFullRedemption) {
                await executeFullRedemption(services, params, t);
            } else {
                const partialResult = await executePartialRedemption(services, params, t);
                result = {
                    cryptoToRedeem: partialResult.cryptoToRedeem,
                    newInitialValue: partialResult.newInitialValue
                };
            }

            await services.acounts.rechargeUserAccount(userId, redeemAmount, t);
            return result;
        });

        if (!isFullRedemption) {
            await services.transactions.create({
                USER_ID: userId,
                INVESTMENT_ID: investmentId,
                TYPE: "REDEMPTION",
                AMOUNT: redeemAmount,
                CRYPTO_AMOUNT: transactionResult.cryptoToRedeem,
                ASSET: asset,
                CREATED_AT: new Date()
            });
        }

        return {
            message: "Redención exitosa",
            redeemedAmount: redeemAmount,
            remaining: isFullRedemption ? 0 : currentValue - redeemAmount,
            newInitialValue: transactionResult.newInitialValue,
            asset: asset
        };

    } catch (error: any) {
        log.error(`Error en proceso de redención: ${error.message}`);
        throw {
            status: error.status || 500,
            message: error.message.includes('foreign key constraint') 
                ? "No se puede eliminar la inversión porque tiene transacciones asociadas"
                : error.message || "Error interno del servidor",
            code: error.code || 9
        };
    }
}

export default function buildCasesRedeemInvestment({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const { INVESTMENT_ID, AMOUNT } = httpRequest.body;
            const userId = log.userData.USER_ID;

            const investmentParams = await validateAndParseInvestment(services, userId, INVESTMENT_ID, AMOUNT);
            const result = await executeRedemption(services, investmentParams, log);

            return utilFunction.httpResponse(200, result, 1);

        } catch (error: any) {
            if (error.status) {
                log.error(`Error controlado: ${error.message}`);
                return utilFunction.httpResponse(error.status, error.message, error.code);
            }

            log.error(`Error inesperado: ${error.stack || error.message}`);
            return utilFunction.httpResponse(500, "Error interno del servidor", 9);
        }
    };
}