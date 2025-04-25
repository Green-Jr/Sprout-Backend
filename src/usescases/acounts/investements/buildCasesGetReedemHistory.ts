// redeemHistory.case.ts
import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

interface RedemptionHistory {
    id: string;
    investmentId: string;
    asset: string;
    amount: number;
    cryptoAmount: number;
    reason?: 'LOSS' | 'PROFIT' | 'MANUAL';
    date: string;
    performancePercentage?: number;
}

export default function buildCasesRedeemHistory({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const userId = log.userData.USER_ID;
            const page =httpRequest.query.LIMIT ? parseInt(httpRequest.query.LIMIT, 10) : 1;
            const limit = httpRequest.query.LIMIT ? parseInt(httpRequest.query.LIMIT, 10) : 100;

            const offset = 0;

            // Obtener el historial de redenciones
            const redemptions = await services.transactions.getRedemptionHistory({
                userId,
                limit,
                offset
            });

            // Formatear la respuesta
            const history: RedemptionHistory[] = redemptions.map((tx: any) => ({
                id: tx.ID,
                investmentId: tx.INVESTMENT_ID,
                asset: tx.ASSET,
                amount: parseFloat(tx.AMOUNT),
                cryptoAmount: parseFloat(tx.CRYPTO_AMOUNT),
                reason: tx.TYPE,
                date: tx.CREATED_AT.toISOString()
            }));

            // Obtener el conteo total para paginación
            const total = await services.transactions.countRedemptions(userId);

            return utilFunction.httpResponse(200, {
                history,
                pagination: {
                    page: page,
                    limit: limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }, 1);

        } catch (error: any) {
            log.error(`Error obteniendo historial de redenciones: ${error.message}`);
            return utilFunction.httpResponse(500, "Error al obtener el historial de redenciones", 9);
        }
    };
}