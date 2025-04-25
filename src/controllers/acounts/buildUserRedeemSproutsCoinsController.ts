import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUserRedeemSproutsCoinsController({ postCasesRedeemSproutsCoins, }: { postCasesRedeemSproutsCoins: any; }) {
    return async function PostRedeemSproutsCoinsController(httpRequest: HttpRequest, log: Logger) {
        try {
            return await postCasesRedeemSproutsCoins(httpRequest, log);
        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    };
}
