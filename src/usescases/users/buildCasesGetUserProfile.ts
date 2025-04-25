
import { Logger } from "../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../utils/types/types";
import utilFunction from "../../utils/utilFunction";

export default function buildCaseGetUserProfile({ services }: { services: any }) {
  return async function getUserProfile(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
    try {
      const userId = log.userData.USER_ID;

      if (!userId) {
        return utilFunction.httpResponse(400, "User ID is required", 9);
      }

      // Consultar la vista USER_ACCOUNT_INFO
      const userInfo = await services.acounts.getUserAccountInfo(userId);

      if (!userInfo) {
        return utilFunction.httpResponse(404, "User profile not found", 2);
      }

      // Mapear la respuesta para el frontend
      const profile = {
        USER_ID: userInfo.USER_ID,
        NAME: userInfo.NAME,
        EMAIL: userInfo.EMAIL,
        MIN_INVESTMENT_AMOUNT: userInfo.MIN_INVESTMENT_AMOUNT,
        ACCOUNT: {
          ACCOUNT_ID: userInfo.ACCOUNT_ID,
          AMOUNT: userInfo.AMOUNT,
          SUB_AMOUNT: userInfo.SUB_AMOUNT,
          SPROUT_COINS: userInfo.SPROUT_COINS,
          PREFERRED_CRYPTOS: userInfo.PREFERRED_CRYPTOS,
          LOSS_PERCENTAGE: userInfo.LOSS_PERCENTAGE,
          PROFIT_PERCENTAGE: userInfo.PROFIT_PERCENTAGE,
          RISK_MANAGEMENT_ENABLED: userInfo.RISK_MANAGEMENT_ENABLED,
        }
      };

      return utilFunction.httpResponse(200, profile, 1);

    } catch (error) {
      const err = error as httpError;
      log.error("Error in getUserProfile: " + err.message);
      return utilFunction.httpResponse(500, err.message ?? "Unexpected error", 2);
    }
  };
}
