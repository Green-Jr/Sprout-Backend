import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesRechargeSproutsCoinsAccount({ services }: { services: any }) {
    return async function postRechargeSproutsCoinsAccount(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {

            const logData = log.userData;
            const IDUSER = logData.USER_ID;

            const rawAmount = httpRequest.body.AMOUNT;
            const AMOUNT = Number(rawAmount);

            if (!AMOUNT || isNaN(AMOUNT) || AMOUNT <= 0) {
                return utilFunction.httpResponse(400, "Invalid amount", 9);
            }


            // 🔄 Recargar la cuenta
            const updated = await services.acounts.rechargeSproutsCoinsUserAccount(IDUSER, AMOUNT);

            if (!updated) {
                return utilFunction.httpResponse(500, "Recharge failed", 9);
            }

            log.info(`💰 User ${IDUSER} recharged with ${AMOUNT}`);

            return utilFunction.httpResponse(200, {
                message: "Account recharged with sprouts coins successfully",
                IDUSER,
                AMOUNT
            }, 1);

        } catch (error) {
            const err = error as httpError;
            log.error("Error in recharge account: " + err.message);
            return utilFunction.httpResponse(500, "Unexpected error", 9);
        }
    };
}
