import { RouterIndex } from "../router.index";
import { makeCallback } from "../../adapter/httpAdapter";
import *  as controllers from "../../controllers/index";


export class RouterAuth extends RouterIndex {
    private controllers = controllers;

    public setupRoutes(): void {

        this.appServer.post(
            this.basePaths + "auth/SendOtpUser",
            makeCallback.buildControllerView(this.controllers.PostOtpUserController)
        );

        this.appServer.post(
            this.basePaths + "auth/SendOtpNewUser",
            makeCallback.buildControllerView(this.controllers.PostOtpNewUserController)
        );

        this.appServer.post(
            this.basePaths + "auth/verifyOtpUser",
            makeCallback.buildControllerView(this.controllers.PostValidOtpUserController)
        );
    }

};
