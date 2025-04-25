import  {Logger}  from "../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse,httpError } from "../../utils/types/types";
import  utilFunction  from "../../utils/utilFunction";

export default function buildCasesUpdateMinInvestmentAmount({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const userId = log.userData.USER_ID;
            const { minInvestmentAmount } = httpRequest.body;

            // 1. Validar entrada
            if (
                typeof minInvestmentAmount !== 'number' ||
                isNaN(minInvestmentAmount) ||
                minInvestmentAmount < 20000
            ) {
                return utilFunction.httpResponse(400, "El monto mínimo debe ser un número mayor o igual a 20000", 9);
            }

            // 2. Actualizar usuario
            const updated = await services.users.updateUser(userId, {
                minInvestmentAmount: minInvestmentAmount
            });

            if (updated[0] === 0) {
                log.error(`❌ No se actualizó el monto mínimo para el usuario ${userId}`);
                return utilFunction.httpResponse(404, "Usuario no encontrado", 2);
            }

            log.info(`💰 Usuario ${userId} actualizó su monto mínimo de inversión a ${minInvestmentAmount}`);

            return utilFunction.httpResponse(200, {
                message: "Monto mínimo de inversión actualizado exitosamente",
                minInvestmentAmount
            }, 1);

        } catch (error) {
            log.error("Error en updateMinInvestmentAmount: " + (error as Error).stack);
            return utilFunction.httpResponse(500, "Error interno", 9);
        }
    };
}
