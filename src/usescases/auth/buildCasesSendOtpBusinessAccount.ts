import { HttpRequest, HttpResponse, httpError } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";
import utilFunction from "../../utils/utilFunction";
import { Constants } from "../../utils/Constanst";
export default function buildCasesPostOtpCodeNewUser({ services }: { services: any }) {
    return async function PostOtpCodeNewUser(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {

            const { email } = httpRequest.body;

            if (!email) {
                return utilFunction.httpResponse(400, "EMAIL is required", 4);
            }

            const user = await services.users.getUserByEmail(email);
            if (user) {
                return utilFunction.httpResponse(404, "Email already exists", 2);
            }

            const codeAuth = utilFunction.generateRandomCodeEmail(6);
            const authTokenOtp = await utilFunction.generateTokenOtp("10m", codeAuth, Constants.auth[0]);
            await services.email.sendEmailWithTemplate(email, { NAME: 'camarada', CODE: codeAuth, });


            return {
                statusCode: 200,
                body: { expireToken: authTokenOtp, email: email }
            };

        } catch (error) {
            const err = error as httpError;
            log.error("Error in verify user and send OTP: " + err.message);
            return utilFunction.httpResponse(500, "Internal Server Error", 9);
        }
    };
}
