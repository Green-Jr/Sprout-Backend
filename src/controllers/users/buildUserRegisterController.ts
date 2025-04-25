import { HttpRequest} from "../../utils/types/types";
import {Logger} from "../../utils/interface/logger.interface";

export default function buildUserRegisterController({postCasesUserRegister}: {postCasesUserRegister: any}) {
    return async function PostRegisterController(httpRequest: HttpRequest, log: Logger) {

        try {
            return  await postCasesUserRegister(httpRequest,log)

        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    }
}