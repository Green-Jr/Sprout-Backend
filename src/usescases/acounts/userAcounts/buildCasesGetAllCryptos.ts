import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildGetAllCryptosCase({ services }: { services: any }) {
    return async function execute(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            // 1. Obtener todas las criptos activas
            const cryptos = await services.cryptos.GetCryptos({
                where: { /* ... */ },
                attributes: ['id', 'symbol', 'name', 'priceCOP'],
                order: [['symbol', 'ASC']]
            });

            return utilFunction.httpResponse(200, {
                message: "Criptomonedas obtenidas exitosamente",
                data: cryptos
            }, 1);

        } catch (error) {
            log.error("Error en getAllCryptos: " + (error as Error).stack);
            return utilFunction.httpResponse(500, "Error al obtener criptomonedas", 9);
        }
    };
}