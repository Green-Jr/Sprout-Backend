import { HttpRequest} from "../../utils/types/types";
import {Logger} from "../../utils/interface/logger.interface";
import utilFunction from "../../utils/utilFunction";


export default function buildPostValidOtpUserController({postCasesValidOtpUser}: {postCasesValidOtpUser: any}) {
    return async function PostOtpValidUserController(httpRequest: HttpRequest, log: Logger) {

        try {
            console.log("VerifyOtpUserController")

            return  await postCasesValidOtpUser(httpRequest,log)

        } catch (error: any) {
            log.error("Unhandled error in controller:" + error);
            return utilFunction.httpResponse(500, error.message || "Unhandled error", 9);
        }
    }
}