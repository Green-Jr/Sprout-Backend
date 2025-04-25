import { RouterIndex } from "../router.index";
import { makeCallback } from "../../adapter/httpAdapter";
import *  as controllers from "../../controllers/index";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export class RouterUsers extends RouterIndex {
    private controllers = controllers;

    public setupRoutes(): void {

        this.appServer.post(
            this.basePaths + "users/RegisterUser",
            makeCallback.buildControllerView(this.controllers.PostRegisterUserController)
        );

        this.appServer.post(
            this.basePaths + "users/LoginUser",
            makeCallback.buildControllerView(this.controllers.PostLoginAuthController)
        );

        this.appServer.get(
            this.basePaths + "users/Profile",
            makeCallback.buildControllerView(this.controllers.GetUserProfileController)
        );

        this.appServer.put(
            this.basePaths + "users/UpdateMinInvestment",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PutUpdateMinInvestmentAmountController)
        );
    }

};