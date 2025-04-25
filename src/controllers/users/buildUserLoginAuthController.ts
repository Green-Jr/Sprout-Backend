import { HttpRequest} from "../../utils/types/types";
import {Logger} from "../../utils/interface/logger.interface";

export default function buildUserLoginAuthController({postCasesUserLoginAuth}: {postCasesUserLoginAuth: any}) {
    return async function PostLoginAuthController(httpRequest: HttpRequest, log: Logger) {

        try {
            return  await postCasesUserLoginAuth(httpRequest,log)

        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    }
}