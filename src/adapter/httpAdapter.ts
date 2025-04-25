import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/log";
import { ControllerFunction } from "../utils/types/types";
import utilFunction from "../utils/utilFunction";

class MakeCallback {
  public buildControllerView(controllers: ControllerFunction, AuthController?: ControllerFunction): any {
    return async (req: Request, res: Response, _: NextFunction) => {
      let log: ReturnType<typeof Logger> | undefined;

      try {
        // Crear instancia segura del log con fallback
        let userData = null;
        try {
          const verifyHeader = req.get("verify");
          if (verifyHeader) {
            userData = await utilFunction.decryptAuth(verifyHeader);
          }
        } catch (err: unknown) {
          const safeError = err as Error;
          console.warn("⚠️ decryptAuth failed:", safeError?.message || err);
        }

        log = Logger(
          userData,
          req.get("Ip") || "",
          req.get("IdLog") || "",
          req.get("Authorization") || "",
          req.get("verify") || "",
          req.headers
        );

        if (!req.get("Ip")) {
          return res.status(503).json({ statusCode: 503, body: "Allowed no IP" });
        }

        const httpRequest = {
          body: req.body,
          query: req.query,
          params: req.params,
          headers: {
            "Content-Type": req.get("Content-Type"),
            Referer: req.get("referer"),
            "User-Agent": req.get("User-Agent"),
            verify: req.get("verify"),
            Authorization: req.get("Authorization"),
          },
        };

        log.debug(httpRequest);

        if (AuthController) {
          const authResponse = await AuthController(httpRequest, log);
          if (!validCallbackAuthorization(authResponse)) {
            log.error("❌ Unauthorized request.");
            return res.status(401).json({
              statusCode: 401,
              body: {
                response: "Unauthorized",
                waitTime: "0ms",
                Code: Math.floor(Math.random() * 1000000),
                warning: 0,
              },
            });
          }
        }

        const httpResponse = await controllers(httpRequest, log);

        if (!httpResponse || typeof httpResponse !== "object" || !("statusCode" in httpResponse)) {
          log.error("❗ Invalid controller response", httpResponse);
          return res.status(500).json({
            statusCode: 500,
            body: {
              response: "Invalid response from controller",
              waitTime: "0ms",
              Code: Math.floor(Math.random() * 1000000),
              warning: "Controller returned invalid structure",
            },
          });
        }

        if (![200, 201, 204].includes(httpResponse.statusCode)) {
          log.error(httpResponse);
        } else {
          log.info(httpResponse);
        }

        return res.status(httpResponse.statusCode).json({
          statusCode: httpResponse.statusCode,
          body: httpResponse.body,
        });

      } catch (err: unknown) {
        const safeError = err as Error;
        const message = safeError?.message || "Unknown error";

        if (log && typeof log.error === "function") {
          log.error("🔥 Unhandled error in `makeCallback`", safeError);
        } else {
          console.error("🔥 Unhandled error (no logger):", message);
        }

        return res.status(500).json({
          statusCode: 500,
          body: {
            response: message,
            waitTime: "0ms",
            Code: Math.floor(Math.random() * 1000000),
            warning: "unhandled error"
          }
        });
      }
    };
  }
}

function validCallbackAuthorization(authResponse: any): boolean {
  try {
    return authResponse?.statusCode === 200;
  } catch (error) {
    Logger().error(error);
    return false;
  }
}

export const makeCallback = new MakeCallback();
