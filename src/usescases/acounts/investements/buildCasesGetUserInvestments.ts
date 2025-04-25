import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesGetUserInvestments({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const userId = log.userData.USER_ID;
            
            // 1. Obtener la cuenta del usuario
            const account = await services.acounts.getUserAccountInfo(userId);
            if (!account) {
                return utilFunction.httpResponse(404, "Cuenta no encontrada", 2);
            }

            // 2. Obtener las inversiones con los precios actuales
            const investments = await services.investments.getUserInvestmentsWithPrices(account.ACCOUNT_ID);

            // 3. Formatear la respuesta
            const formattedInvestments = investments.map((inv: any) => ({
                id: inv.ID,
                asset: inv.ASSET,
                cryptoAmount: inv.CRYPTO_AMOUNT,
                currentValue: inv.CURRENT_VALUE,
                initialValue: inv.INIT_VALUE,
                currentPrice: inv.currentCryptoPrice,
                performancePercentage: ((inv.CURRENT_VALUE - inv.INIT_VALUE) / inv.INIT_VALUE * 100).toFixed(2),
                generatedDate: inv.GENERATED_DATE
            }));

            return utilFunction.httpResponse(200, {
                investments: formattedInvestments,
                totalCurrentValue: investments.reduce((sum: number, inv: any) => sum + inv.CURRENT_VALUE, 0),
                totalInitialValue: investments.reduce((sum: number, inv: any) => sum + inv.INIT_VALUE, 0)
            }, 1);

        } catch (error) {
            log.error(`Error obteniendo inversiones: ${(error as Error).message} | UserId: ${log.userData.USER_ID} | Stack: ${(error as Error).stack}`);
            return utilFunction.httpResponse(500, "Error al obtener inversiones", 9);
        }
    };
}