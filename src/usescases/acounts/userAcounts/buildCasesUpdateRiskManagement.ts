import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesUpdateRiskManagement({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const userId = log.userData.USER_ID;
            const {
                lossPercentage,
                profitPercentage,
                riskManagementEnabled
            } = httpRequest.body;

            // 1. Validar entrada básica
            if (typeof riskManagementEnabled !== 'boolean') {
                return utilFunction.httpResponse(400, "El campo riskManagementEnabled debe ser un booleano", 9);
            }

            // 2. Validaciones cuando la gestión de riesgo está activada
            if (riskManagementEnabled) {
                // Validar que vengan ambos porcentajes
                if (lossPercentage === undefined || profitPercentage === undefined) {
                    return utilFunction.httpResponse(
                        400,
                        "Cuando riskManagementEnabled es true, ambos porcentajes son requeridos",
                        9
                    );
                }

                // Validar tipos y rangos
                if (typeof lossPercentage !== 'number' || lossPercentage < 0 || lossPercentage > 100) {
                    return utilFunction.httpResponse(
                        400,
                        "El porcentaje de pérdida debe ser un número entre 0 y 100",
                        9
                    );
                }

                if (typeof profitPercentage !== 'number' || profitPercentage < 0) {
                    return utilFunction.httpResponse(
                        400,
                        "El porcentaje de ganancia debe ser un número positivo",
                        9
                    );
                }

                // Validar que no sean ambos cero (lo que no tendría sentido)
                if (lossPercentage === 0 && profitPercentage === 0) {
                    return utilFunction.httpResponse(
                        400,
                        "Los porcentajes no pueden ser ambos cero",
                        9
                    );
                }
            }

            // 3. Preparar datos para actualización
            const updateData: any = {
                riskManagementEnabled
            };

            // Actualizar porcentajes basado en el estado de riskManagementEnabled
            if (riskManagementEnabled) {
                updateData.lossPercentage = lossPercentage;
                updateData.profitPercentage = profitPercentage;
            }

            // 4. Actualizar preferencias
            const updated = await services.acounts.updateUserAccount(userId, updateData);

            if (updated[0] === 0) {
                log.error(`No se actualizó ninguna cuenta para el usuario ${userId}`);
                return utilFunction.httpResponse(404, "Cuenta no encontrada", 2);
            }

            log.info(`🔄 Usuario ${userId} actualizó sus preferencias de riesgo: ` +
                `Pérdida: ${riskManagementEnabled ? lossPercentage : 'N/A'}%, ` +
                `Ganancia: ${riskManagementEnabled ? profitPercentage : 'N/A'}%, ` +
                `Activado: ${riskManagementEnabled}`);

            return utilFunction.httpResponse(200, {
                message: "Preferencias de riesgo actualizadas exitosamente",
                riskManagement: {
                    lossPercentage: riskManagementEnabled ? lossPercentage : null,
                    profitPercentage: riskManagementEnabled ? profitPercentage : null,
                    riskManagementEnabled
                }
            }, 1);

        } catch (error) {
            log.error("Error en updateRiskManagement: " + (error as Error).stack);
            return utilFunction.httpResponse(500, "Error interno", 9);
        }
    };
}