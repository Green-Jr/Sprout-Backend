import { HttpRequest} from "../../utils/types/types";
import {Logger} from "../../utils/interface/logger.interface";

export default function buildAuthorizationController({getCasesAuthorization}: {getCasesAuthorization: any}) {
    return async function PostAuthorizationController(httpRequest: HttpRequest, log: Logger) {

        try {
            return  await getCasesAuthorization(httpRequest,log)

        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    }
}