import { Logger } from "../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../utils/types/types";
import utilFunction from "../../utils/utilFunction";
import jwt from "jsonwebtoken";

export default function buildCasesLoginAuth({ services }: { services: any }) {
  return async function postLoginLoginAuth(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
    try {
      const { email, otpToken } = httpRequest.body;

      if (!email || !otpToken) {
        return utilFunction.httpResponse(400, "Email and otpToken are required", 9);
      }

      // 🔐 Consultamos el usuario para obtener el ID y validar el OTP
      const user = await services.users.getUserByEmail(email);
      if (!user) {
        return utilFunction.httpResponse(404, "User not found", 2);
      }

      // 🔐 Verificamos el token OTP (JWT ligado al ID del usuario)
      const decoded: any = jwt.verify(otpToken, user.id, {
        algorithms: ["HS256"]
      });

      if (!decoded || decoded.jti !== user.id) {
        return utilFunction.httpResponse(401, "Invalid or expired OTP token", 2);
      }

      // 🔹 Consultamos la vista con la info completa del usuario
      const userInfo = await services.acounts.getUserAccountInfo(user.id);
      if (!userInfo) {
        return utilFunction.httpResponse(404, "User info not found", 2);
      }

      // 🔹 Generamos el JWT token de acceso
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d", algorithm: "HS256" }
      );

      // 🔹 Creamos el verify como JSON base64
      const verifyPayload = {
        USER_ID: user.id,
        ACCOUNT_ID: userInfo.ACCOUNT_ID,
        NAME: user.name,
        EMAIL: user.email
      };
      const verify = Buffer.from(JSON.stringify(verifyPayload)).toString("base64");

      // 🔹 Devolvemos toda la info
      return utilFunction.httpResponse(200, {
        token: accessToken,
        verify,
        user: userInfo,
      }, 1);

    } catch (error) {
        const err = error as httpError;
        log.error("Error in login final: " + err.message);
        return utilFunction.httpResponse(500, err.message ?? "Unexpected error", 2);
    }
  };
}
