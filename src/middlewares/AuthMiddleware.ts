import { Request, Response, NextFunction } from "express";
import { makeCallback } from "../adapter/httpAdapter";
import * as controllers from "../controllers/index";
import { Logger } from "../utils/log";
import utilFunction from "../utils/utilFunction";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Crear el objeto de log desde los headers
    const log = Logger(
      req.get("verify") ? await utilFunction.decryptAuth(req.get("verify")) : null,
      req.get("Ip") as string, 
      req.get("IdLog"),
      req.get("Authorization"),
      req.get("verify"),
      req.headers
    );

    const httpRequest = {
      headers: {
        Authorization: req.get("Authorization"),
        verify: req.get("verify"),
      },
      body: req.body,
      query: req.query,
      params: req.params,
    };

    // ✅ Llamamos correctamente al controlador con los 3 parámetros
    // const authController = makeCallback.buildControllerView(controllers.PostAuthorizationController);
    // const authResponse = await authController(httpRequest, null, log); // Se pasa `null` en el segundo parámetro

    const authResponse = await controllers.PostAuthorizationController(httpRequest, log);

    if (authResponse.statusCode !== 200) {
      res.status(401).json({ message: "Unauthorized" });
      return; // 🔹 Aseguramos que el middleware finaliza la ejecución
    }

    next(); // Si la validación es correcta, pasa al siguiente middleware/controlador
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
    return;
  }
};
