import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesCancelPurchase({ services }: { services: any }) {
    return async function postCancelPurchase(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const logData = log.userData;
            const ID_USER = logData.USER_ID;
            const { PURCHASE_ID } = httpRequest.body;

            if (!PURCHASE_ID) {
                return utilFunction.httpResponse(400, "Missing purchase ID", 9);
            }

            const purchase = await services.purchase.getPurchaseById(PURCHASE_ID);

            if (!purchase || purchase.userId !== ID_USER) {
                return utilFunction.httpResponse(404, "Purchase not found", 2);
            }

            if (purchase.stateOrder !== 1) {
                return utilFunction.httpResponse(400, "Only pending purchases can be canceled", 2);
            }

            const totalToRefund = Number(purchase.amount) + Number(purchase.saveAmount);

            const updated = await services.purchase.cancelPurchase(PURCHASE_ID);
            if (!updated) {
                return utilFunction.httpResponse(500, "Failed to cancel purchase", 9);
            }

            const refunded = await services.acounts.rechargeUserAccount(ID_USER, totalToRefund);
            if (!refunded) {
                return utilFunction.httpResponse(500, "Failed to refund user", 9);
            }

            if (purchase.saveAmount > 0) {
                const unsaved = await services.acounts.decreaseUserSubAmount(ID_USER, purchase.saveAmount);
                if (!unsaved) {
                    return utilFunction.httpResponse(500, "Failed to update user savings", 9);
                }
            }

            log.info(`❌ Compra cancelada para el usuario ${ID_USER}. Se reembolsó ${totalToRefund}`);

            return utilFunction.httpResponse(200, {
                message: "Purchase canceled and funds refunded",
                refunded: totalToRefund
            }, 1);

        } catch (error) {
            const err = error as httpError;
            log.error("Error in cancel purchase: " + err.message);
            return utilFunction.httpResponse(500, "Unexpected error", 9);
        }
    };
}
