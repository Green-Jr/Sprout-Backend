import { Logger } from "./interface/logger.interface";

interface InvestmentRiskAnalysis {
    investmentId: string;
    accountId: string;
    userId: string;
    asset: string;
    currentValue: number;
    initialValue: number;
    shouldRedeem: boolean;
    reason?: 'LOSS' | 'PROFIT';
    performancePercentage: number;
}

export async function executeAutomaticRiskManagement(services: any, log: Logger): Promise<void> {
    try {
        log.info('Iniciando proceso de gestión de riesgo automático');

        // 1. Obtener cuentas con gestión de riesgo activada
        const accounts = await services.acounts.getAllAccountsWithRiskManagementEnabled();
        log.info(`Encontradas ${accounts.length} cuentas con gestión de riesgo activada`);

        // 2. Procesar cada cuenta
        for (const account of accounts) {
            try {
                await processAccountInvestments(account, services, log);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                log.error(`Error procesando cuenta: ${errorMessage}`);
                continue;
            }
        }

        log.info('✅ Proceso de gestión de riesgo automático completado');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log.error(`❌ Error crítico en executeAutomaticRiskManagement: ${errorMessage}`);
        throw error;
    }
}

async function processAccountInvestments(account: any, services: any, log: Logger): Promise<void> {
    // Normalización de propiedades
    const normalizedAccount = {
        ID: account.id || account.ID,
        ID_USER: account.userId || account.ID_USER,
        LOSS_PERCENTAGE: account.lossPercentage ?? account.LOSS_PERCENTAGE,
        PROFIT_PERCENTAGE: account.profitPercentage ?? account.PROFIT_PERCENTAGE
    };

    // Validación robusta
    if (!normalizedAccount.ID || normalizedAccount.LOSS_PERCENTAGE === null || normalizedAccount.PROFIT_PERCENTAGE === null) {
        log.warn(`⚠️ Cuenta ${normalizedAccount.ID || 'sin ID'} no tiene umbrales configurados correctamente`);
        return;
    }

    try {
        log.info(`🔍 Procesando inversiones para cuenta ${normalizedAccount.ID}`);
        
        // Obtener inversiones de la cuenta
        const investments = await services.investments.getInvestmentsByAccountId(normalizedAccount.ID);
        
        // Analizar cada inversión
        const investmentsToRedeem = investments
            .map((investment: any) => analyzeInvestment(investment, normalizedAccount, log))
            .filter((analysis: InvestmentRiskAnalysis) => analysis.shouldRedeem);

        // Ejecutar redenciones si hay alguna
        if (investmentsToRedeem.length > 0) {
            log.info(`🔄 Encontradas ${investmentsToRedeem.length} inversiones para redimir`);
            await executeRedemptionWorkflow(investmentsToRedeem, services, log);
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log.error(`❌ Error procesando cuenta ${normalizedAccount.ID}: ${errorMessage}`);
        throw error;
    }
}

async function executeRedemptionWorkflow(
    investments: InvestmentRiskAnalysis[],
    services: any,
    log: Logger
): Promise<void> {
    for (const investment of investments) {
        try {
            log.info(`💳 Iniciando redención automática de ${investment.investmentId} (${investment.reason})`);

            // 1. Obtener datos completos de la inversión
            const fullInvestment = await services.investments.getUserInvestment(
                investment.userId,
                investment.investmentId
            );

            if (!fullInvestment?.dataValues) {
                throw new Error("Inversión no encontrada");
            }

            // 2. Ejecutar transacción atómica
            await services.transactions.executeAtomic(async (t: any) => {
                // Registrar transacción
                await services.transactions.create({
                    USER_ID: investment.userId,
                    INVESTMENT_ID: investment.investmentId,
                    TYPE: "REDEMPTION",
                    AMOUNT: investment.currentValue,
                    CRYPTO_AMOUNT: fullInvestment.dataValues.CRYPTO_AMOUNT,
                    ASSET: investment.asset,
                    CREATED_AT: new Date()
                }, { transaction: t });

                // Eliminar inversión (redención total)
                await services.investments.deleteInvestment(investment.investmentId, { transaction: t });

                // Recargar cuenta del usuario
                await services.acounts.rechargeUserAccount(
                    investment.userId,
                    investment.currentValue,
                    t
                );
            });

            log.info(`✅ Redención completada para ${investment.investmentId}`);
            
            // 3. Notificación opcional
            await sendRedemptionNotification(investment, services, log);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            log.error(`❌ Error redimiendo ${investment.investmentId}: ${errorMessage}`);
        }
    }
}

async function sendRedemptionNotification(
    investment: InvestmentRiskAnalysis,
    services: any,
    log: Logger
): Promise<void> {


    try {
        // Obtener email del servicio de usuarios
        const user = await services.users.getUserById(investment.userId);
        const userEmail = user?.email;
        
        if (!userEmail) {
            log.warn(`No se encontró email para usuario ${investment.userId}`);
            return;
        }
        
        const emailSent = await services.email.sendRedemptionEmail(
            userEmail,
            {
                title: `Redención automática (${investment.reason === 'LOSS' ? 'Pérdida' : 'Ganancia'})`,
                message: `Inversión en ${investment.asset} liquidada (${investment.performancePercentage}%)`,
                asset: investment.asset,
                amount: `$${investment.currentValue.toLocaleString()}`,
                performance: `${investment.performancePercentage}%`,
                reason: investment.reason === 'LOSS' ? 'Pérdida' : 'Ganancia'
            }
        );

        if (emailSent) {
            log.info(`📩 Notificación de redención enviada a ${userEmail}`);
        } else {
            log.warn(`⚠️ No se pudo enviar notificación a ${userEmail}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log.error(`⚠️ Error enviando notificación: ${errorMessage}`);
    }
}
function analyzeInvestment(investment: any, account: any, log: Logger): InvestmentRiskAnalysis {
    // Parseo seguro de valores
    const currentValue = parseFloat(investment.CURRENT_VALUE) || 0;
    const initialValue = parseFloat(investment.INIT_VALUE) || 0;
    const performancePercentage = initialValue !== 0 
        ? ((currentValue - initialValue) / initialValue) * 100 
        : 0;
    const roundedPerformance = parseFloat(performancePercentage.toFixed(2));

    const result: InvestmentRiskAnalysis = {
        investmentId: investment.ID,
        accountId: account.ID,
        userId: account.ID_USER,
        asset: investment.ASSET,
        currentValue,
        initialValue,
        performancePercentage: roundedPerformance,
        shouldRedeem: false
    };

    // Evaluar umbrales
    if (roundedPerformance <= -account.LOSS_PERCENTAGE) {
        result.shouldRedeem = true;
        result.reason = 'LOSS';
        log.info(`📉 Inversión ${investment.ID} bajo umbral de pérdida (${roundedPerformance}% <= -${account.LOSS_PERCENTAGE}%)`);
    } 
    else if (roundedPerformance >= account.PROFIT_PERCENTAGE) {
        result.shouldRedeem = true;
        result.reason = 'PROFIT';
        log.info(`📈 Inversión ${investment.ID} sobre umbral de ganancia (${roundedPerformance}% >= ${account.PROFIT_PERCENTAGE}%)`);
    }

    return result;
}