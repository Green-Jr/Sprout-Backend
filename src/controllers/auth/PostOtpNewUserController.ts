import { HttpRequest} from "../../utils/types/types";
import {Logger} from "../../utils/interface/logger.interface";

export default function buildPostOtpNewUserController({postCasesOtpNewUser}: {postCasesOtpNewUser: any}) {
    return async function PostOtpUserController(httpRequest: HttpRequest, log: Logger) {

        try {
            return  await postCasesOtpNewUser(httpRequest,log)

        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    }
}