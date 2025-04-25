import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUserRedeemInvestementsController({ postCasesRedeemInvestements, }: { postCasesRedeemInvestements: any; }) {
    return async function PostRedeemInvestementsController(httpRequest: HttpRequest, log: Logger) {
        try {
            return await postCasesRedeemInvestements(httpRequest, log);
        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    };
}
