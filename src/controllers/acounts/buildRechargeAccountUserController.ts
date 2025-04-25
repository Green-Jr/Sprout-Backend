import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUserRechargeAccountController({ postCasesRechargeAccount }: { postCasesRechargeAccount: any }) {
    return async function PostRechargeAccountController(httpRequest: HttpRequest, log: Logger) {
        try {
            return await postCasesRechargeAccount(httpRequest, log);
        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    };
}
