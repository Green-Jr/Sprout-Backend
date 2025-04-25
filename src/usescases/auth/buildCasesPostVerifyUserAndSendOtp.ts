import { Logger } from "../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../utils/types/types";
import utilFunction from "../../utils/utilFunction";
import bcrypt from "bcrypt";

export default function buildCasesVerifyUserAndSendOtp({ services }: { services: any }) {
  return async function postVerifyUserAndSendOtp(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email || !password) {
        return utilFunction.httpResponse(400, "Email and password are required", 9);
      }

      const user = await services.users.getUserByEmail(email);
      if (!user) {
        return utilFunction.httpResponse(404, "User not found", 2);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return utilFunction.httpResponse(401, "Invalid credentials", 2);
      }

      const codeAuth = utilFunction.generateRandomCodeEmail(6);
      const authTokenOtp = await  utilFunction.generateTokenOtp("5m",codeAuth, user.id)
      await services.email.sendEmailWithTemplate(user.email, { NAME: user.name, CODE: codeAuth,});

      return {
        statusCode:200,
        body:{
            message: "OTP sent to email",
            expireToken: authTokenOtp,
        }
        
      };
    } catch (error) {
      const err = error as httpError;
      log.error("Error in verify user and send OTP: " + err.message);
      return utilFunction.httpResponse(500, "Internal Server Error", 9);
    }
  };
}
