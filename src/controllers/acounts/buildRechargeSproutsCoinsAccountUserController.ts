import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUserRechargeSproutsCoinsAccountController({ postCasesRechargeSproutsCoinsAccount }: { postCasesRechargeSproutsCoinsAccount: any }) {
    return async function PostRechargeSproutsCoinsAccountController(httpRequest: HttpRequest, log: Logger) {
        try {
            return await postCasesRechargeSproutsCoinsAccount(httpRequest, log);
        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    };
}
