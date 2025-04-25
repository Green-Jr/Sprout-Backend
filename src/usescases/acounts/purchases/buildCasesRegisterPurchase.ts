import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesMakePurchase({ services }: { services: any }) {
    return async function postMakePurchase(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const logData = log.userData;
            const ID_USER = logData.USER_ID;

            const rawAmount = httpRequest.body.AMOUNT;
            const AMOUNT = Number(rawAmount);
            if (!AMOUNT || isNaN(AMOUNT) || AMOUNT <= 0) {
                return utilFunction.httpResponse(400, "Invalid amount", 9);
            }

            const rawSaveAmount = httpRequest.body.SAVE_AMOUNT || 0;
            const SAVE_AMOUNT = Number(rawSaveAmount);
            const totalAmount = AMOUNT + SAVE_AMOUNT;

            const NAME = httpRequest.body.NAME || "Compra sin nombre";
            // 1. Obtener el saldo actual del usuario
            const userAccount = await services.acounts.getAccountByUserId(ID_USER);
            if (!userAccount) {
                return utilFunction.httpResponse(404, "User account not found", 2);
            }

            const currentBalance = Number(userAccount.AMOUNT);
            if (currentBalance < totalAmount) {
                return utilFunction.httpResponse(403, "Insufficient funds", 2);
            }

            // 2. Registrar la compra
            const newPurchase = await services.purchase.createPurchase({
                userId: ID_USER,
                amount: AMOUNT,
                saveAmount: SAVE_AMOUNT,
                name: NAME,
                stateOrder: 1
            });

            if (!newPurchase) {
                return utilFunction.httpResponse(500, "Failed to register purchase", 9);
            }

            // 3. Descontar el monto total del saldo
            const updated = await services.acounts.decreaseUserBalance(ID_USER, totalAmount);
            if (!updated) {
                return utilFunction.httpResponse(500, "Failed to update user balance", 9);
            }

            // 4. Aumentar el ahorro acumulado (SUB_AMOUNT)
            if (SAVE_AMOUNT > 0) {
                const saved = await services.acounts.increaseUserSubAmount(ID_USER, SAVE_AMOUNT);
                if (!saved) {
                    return utilFunction.httpResponse(500, "Failed to update user savings", 9);
                }
            }

            log.info(`🛒 Compra registrada para el usuario ${ID_USER} por ${AMOUNT} (Save: ${SAVE_AMOUNT})`);

            return utilFunction.httpResponse(201, {
                message: "Purchase registered and balance updated",
                purchase: newPurchase
            }, 1);

        } catch (error) {
            const err = error as httpError;
            log.error("Error in make purchase: " + err.message);
            return utilFunction.httpResponse(500, "Unexpected error", 9);
        }
    };
}
