import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesGetUserPurchasesCase({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const userId = log.userData.USER_ID;
            const { page = 1, limit = 100, stateOrder } = httpRequest.query;

            // Validación y conversión de parámetros
            const pageNum = Number(page);
            const limitNum = Number(limit);
            const stateOrderNum = stateOrder !== undefined ? Number(stateOrder) : undefined;

            // Validación de tipos
            if (isNaN(pageNum) || isNaN(limitNum) || 
                (stateOrder !== undefined && isNaN(stateOrderNum as number))) {
                return utilFunction.httpResponse(400, "Parámetros inválidos", 9);
            }

            // Configurar filtros con tipos seguros
            const whereClause: { userId: string; stateOrder?: number } = { userId };
            
            if (stateOrderNum !== undefined && [1, 2, 3].includes(stateOrderNum)) {
                whereClause.stateOrder = stateOrderNum;
            }

            // Obtener compras con paginación
            const purchases = await services.purchase.getUserPurchases({
                where: whereClause,
                limit: limitNum,
                offset: (pageNum - 1) * limitNum,
                order: [['GENERATED_DATE', 'DESC']]
            });

            // Obtener conteo total
            const totalCount = await services.purchase.getCount({ where: whereClause });

            return utilFunction.httpResponse(200, {
                message: "Compras obtenidas exitosamente",
                data: purchases,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalCount / limitNum),
                    totalItems: totalCount,
                    itemsPerPage: limitNum
                }
            }, 1);

        } catch (error) {
            log.error("Error en getUserPurchases: " + (error as Error).stack);
            return utilFunction.httpResponse(500, "Error interno", 9);
        }
    };
}