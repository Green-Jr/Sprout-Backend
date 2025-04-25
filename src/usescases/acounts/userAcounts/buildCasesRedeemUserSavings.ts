import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesRedeemSavings({ services }: { services: any }) {
  return async function postRedeemSavings(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
    try {
      const logData = log.userData;
      const ID_USER = logData.USER_ID;

      const rawAmount = httpRequest.body.AMOUNT;
      const AMOUNT_TO_REDEEM = Number(rawAmount);

      if (!AMOUNT_TO_REDEEM || isNaN(AMOUNT_TO_REDEEM) || AMOUNT_TO_REDEEM <= 0) {
        return utilFunction.httpResponse(400, "Invalid redeem amount", 9);
      }

      const account = await services.acounts.getAccountByUserId(ID_USER);
      if (!account) {
        return utilFunction.httpResponse(404, "User account not found", 2);
      }

      const currentSavings = Number(account.SUB_AMOUNT);
      if (isNaN(currentSavings) || currentSavings < AMOUNT_TO_REDEEM) {
        return utilFunction.httpResponse(403, "Insufficient savings to redeem", 2);
      }

      // 1. Sumar al saldo principal
      const increased = await services.acounts.rechargeUserAccount(ID_USER, AMOUNT_TO_REDEEM);
      if (!increased) {
        return utilFunction.httpResponse(500, "Failed to add to balance", 9);
      }

      // 2. Restar del ahorro
      const reduced = await services.acounts.decreaseUserSubAmount(ID_USER, AMOUNT_TO_REDEEM);
      if (!reduced) {
        return utilFunction.httpResponse(500, "Failed to decrease savings", 9);
      }

      log.info(`💵 Usuario ${ID_USER} redimió ${AMOUNT_TO_REDEEM} de sus ahorros`);

      return utilFunction.httpResponse(200, {
        message: "Savings redeemed successfully",
        redeemedAmount: AMOUNT_TO_REDEEM
      }, 1);

    } catch (error) {
      const err = error as httpError;
      log.error("Error in redeem savings: " + err.message);
      return utilFunction.httpResponse(500, "Unexpected error", 9);
    }
  };
}
