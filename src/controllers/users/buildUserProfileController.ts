import { HttpRequest} from "../../utils/types/types";
import {Logger} from "../../utils/interface/logger.interface";

export default function buildUserProfileController({postCasesUserProfile}: {postCasesUserProfile: any}) {
    return async function PostProfileController(httpRequest: HttpRequest, log: Logger) {

        try {
            return  await postCasesUserProfile(httpRequest,log)

        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    }
}