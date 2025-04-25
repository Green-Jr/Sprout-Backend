import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildUpdatePreferredCryptosCase({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const userId = log.userData.USER_ID;
            const { cryptos } = httpRequest.body; // Ejemplo: ["BTC", "ETH", "SOL"]

            // 1. Validar entrada
            if (!Array.isArray(cryptos) || cryptos.length === 0) {
                return utilFunction.httpResponse(400, "Lista de criptomonedas inválida", 9);
            }

            // 2. Verificar que las criptos existan
            const existingCryptos = await services.cryptos.GetCryptos({
                where: { symbol: cryptos },
                attributes: ['symbol'],
                raw: true
            });

            const existingSymbols = existingCryptos.map((c: any) => c.symbol);
            const invalidCryptos = cryptos.filter((c: string) => !existingSymbols.includes(c));

            if (invalidCryptos.length > 0) {
                return utilFunction.httpResponse(400, `Criptomonedas no válidas: ${invalidCryptos.join(', ')}`, 9);
            }

            // 3. Actualizar preferencias (transacción atómica)
            const updated = await services.acounts.updateUserAccount(userId, {
                preferredCryptos: cryptos
            });

            console.log('updated', updated)

            if (updated[0] === 0) {
                log.error(`No se actualizó ninguna cuenta para el usuario ${userId}`);
                return utilFunction.httpResponse(404, "Cuenta no encontrada", 2);
            }

            log.info(`🔄 Usuario ${userId} actualizó sus criptos preferidas: ${cryptos.join(', ')}`);

            return utilFunction.httpResponse(200, {
                message: "Preferencias actualizadas exitosamente",
                updatedCryptos: cryptos
            }, 1);

        } catch (error) {
            log.error("Error en updatePreferredCryptos: " + (error as Error).stack);
            return utilFunction.httpResponse(500, "Error interno", 9);
        }
    };
}