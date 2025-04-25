import { Request, Response, NextFunction } from "express";

export const AuthPassport = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" });
      return; // ✅ Evita que el middleware devuelva una respuesta
    }

    // ✅ Si la validación es exitosa, llama `next()`
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
