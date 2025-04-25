import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";
import { Constants } from "../../../utils/Constanst";

export default function buildCasesRedeemSproutCoins({ services }: { services: any }) {
  return async function postRedeemSproutCoins(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
    try {
      const logData = log.userData;
      const ID_USER = logData.USER_ID;
      const SPROUT_COIN_VALUE = Constants.values.SPROUTS_COINS; 


      // 1. Validar y convertir el input (ahora en Sprout Coins)
      const rawSproutCoins = httpRequest.body.SPROUT_COINS; // Cambiado de AMOUNT a SPROUT_COINS
      const SPROUT_COINS_TO_REDEEM = Number(rawSproutCoins);

      if (!SPROUT_COINS_TO_REDEEM || isNaN(SPROUT_COINS_TO_REDEEM) || SPROUT_COINS_TO_REDEEM <= 0) {
        return utilFunction.httpResponse(400, "Cantidad de Sprout Coins inválida", 9);
      }

      // 2. Obtener cuenta y validar saldo
      const account = await services.acounts.getAccountByUserId(ID_USER);
      if (!account) {
        return utilFunction.httpResponse(404, "Cuenta no encontrada", 2);
      }

      const currentSproutCoins = Number(account.SPROUT_COINS);
      if (isNaN(currentSproutCoins) || currentSproutCoins < SPROUT_COINS_TO_REDEEM) {
        return utilFunction.httpResponse(403, "Sprout Coins insuficientes", 2);
      }

      // 3. Convertir a valor monetario
      const MONETARY_VALUE = SPROUT_COINS_TO_REDEEM * SPROUT_COIN_VALUE;

      // 4. Procesar transacciones (ahora con el valor convertido)
      const increased = await services.acounts.rechargeUserAccount(ID_USER, MONETARY_VALUE);
      if (!increased) {
        return utilFunction.httpResponse(500, "Error al recargar saldo", 9);
      }

      const reduced = await services.acounts.redeemSproutsCoinsUserAccount(ID_USER, SPROUT_COINS_TO_REDEEM);
      if (!reduced) {
        // ¡Importante! Revertir la recarga si falla la reducción
        await services.acounts.rechargeSproutsCoinsUserAccount(ID_USER, -MONETARY_VALUE);
        return utilFunction.httpResponse(500, "Error al descontar Sprout Coins", 9);
      }

      log.info(`💎 Usuario ${ID_USER} redimió ${SPROUT_COINS_TO_REDEEM} SC ($${MONETARY_VALUE})`);

      return utilFunction.httpResponse(200, {
        message: "Reclamo exitoso",
        redeemedSproutCoins: SPROUT_COINS_TO_REDEEM,
        monetaryValue: MONETARY_VALUE
      }, 1);

    } catch (error) {
      const err = error as httpError;
      log.error("Error en redeemSavings: " + err.message);
      return utilFunction.httpResponse(500, "Error interno", 9);
    }
  };
}