import { HttpRequest, HttpResponse } from "../../utils/types/types";
import utilFunction from "../../utils/utilFunction";
import jwt from "jsonwebtoken";

export default function buildAuthorizationCases({ services }: { services: any }) {
  return async function getCasesAuthorization(httpRequest: HttpRequest, log: any): Promise<HttpResponse> {
    try {
      const { Authorization } = httpRequest.headers;
      const logData = log.userData;
      const IDUSER = logData.USER_ID;

      if (!Authorization || !logData) {
        log.warn("Missing Authorization or verify header");
        return utilFunction.httpResponse(401, "Missing Authorization or verify header", 1);
      }
      const token = Authorization.replace("Bearer ", "");

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string, {
        algorithms: ["HS256"],
      });

      // Validación cruzada entre JWT y verify
      if (decoded.userId !== IDUSER) {
        log.warn("Token and verify mismatch");
        return utilFunction.httpResponse(401, "Invalid verify or token mismatch", 1);
      }

      // Validar que el usuario exista en la base de datos
      const user = await services.users.getUserById(IDUSER);
      if (!user) {
        log.warn("User not found");
        return utilFunction.httpResponse(404, "User not found", 2);
      }

      return utilFunction.httpResponse(200, { message: "Middleware ok" }, 0);
    } catch (error: any) {
      log.error("Authorization failed:", error.message);
      return utilFunction.httpResponse(401, error.message ?? "Unauthorized", 1);
    }
  };
}
