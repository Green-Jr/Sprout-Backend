import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUserRedeemSavingsController({ postCasesRedeemSavings, }: { postCasesRedeemSavings: any; }) {
    return async function PostRedeemSavingsController(httpRequest: HttpRequest, log: Logger) {
        try {
            return await postCasesRedeemSavings(httpRequest, log);
        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    };
}
