import { HttpRequest} from "../../utils/types/types";
import {Logger} from "../../utils/interface/logger.interface";

export default function buildPostOtpUserController({postCasesOtpUser}: {postCasesOtpUser: any}) {
    return async function PostOtpUserController(httpRequest: HttpRequest, log: Logger) {

        try {
            return  await postCasesOtpUser(httpRequest,log)

        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    }
}