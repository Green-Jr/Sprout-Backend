import express, { RequestHandler } from 'express';
import setting from "../data/settings.json";

export class RouterIndex {
    protected basePaths = "/" + setting.path + "/";
    
    constructor(protected appServer: express.Application, protected AuthPassport: RequestHandler) {} // ✅ Cambiado a `RequestHandler`

    public setupRoutes(): void {
        throw new Error("Method 'setupRoutes' must be implemented.");
    }
}
