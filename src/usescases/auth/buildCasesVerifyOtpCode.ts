import { Logger } from "../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../utils/types/types";
import utilFunction from "../../utils/utilFunction";
import jwt from "jsonwebtoken";

export default function buildCasesVerifyOtpCode({ services }: { services: any }) {
  return async function postVerifyOtpCode(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
    try {
      log.info("Verifying otp code (use case)");

      const { otpCode, expireToken } = httpRequest.body;

      if (!otpCode || !expireToken) {
        log.warn("Missing otpCode or expireToken");
        return utilFunction.httpResponse(400, "OTP code and token are required", 9);
      }

      log.info(`Verifying OTP: ${otpCode} with token: ${expireToken}`);
      const decoded: any = utilFunction.validTokenOtp(expireToken, otpCode);

      const tokenFinal = jwt.sign(
        { jti: decoded.jti }, // usamos jti porque así lo esperas en el login
        decoded.jti,          // la clave es el ID del usuario (misma usada luego en verify)
        { expiresIn: "5m", algorithm: "HS256" }
      );

      return utilFunction.httpResponse(200, {
        message: "OTP validated successfully",
        token: tokenFinal
      }, 1);

    } catch (error: any) {
      log.error("Error in verify OTP code"+ error);
      return utilFunction.httpResponse(401, error.message ?? "Invalid or expired OTP", 2);
    }
  };
}
