import { RouterIndex } from "../router.index";
import { makeCallback } from "../../adapter/httpAdapter";
import *  as controllers from "../../controllers/index";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export class RouterAcounts extends RouterIndex {
    private controllers = controllers;

    public setupRoutes(): void {

        this.appServer.post(
            this.basePaths + "acounts/RechargeAcount",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PostRechargeAccountController)
        );

        this.appServer.post(
            this.basePaths + "acounts/RechargeSproutsCoins",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PostRechargeSproutsCoinsAccountController)
        );

        this.appServer.get(
            this.basePaths + "acounts/SearchProducts",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.GetSearchProductsUserController)
        );

        this.appServer.post(
            this.basePaths + "acounts/MakePurchase",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PostRegisterPurchaseController)
        );

        this.appServer.get(
            this.basePaths + "acounts/Purchases",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.GetPurchaseUsersController)
        );

        this.appServer.post(
            this.basePaths + "acounts/CanceledPurchase",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PostCancelPurchaseController)
        );

        this.appServer.post(
            this.basePaths + "acounts/RedeemSavings",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PostRedeemSavingsController)
        );

        this.appServer.post(
            this.basePaths + "acounts/RedeemSproutsCoins",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PostRedeemSproutsCoinsController)
        );
        
        this.appServer.post(
            this.basePaths + "acounts/RedeemInvestements",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PostRedeemInvestementsController)
        );

        this.appServer.get(
            this.basePaths + "acounts/ViewInvestements",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.GetUserInvestemetsController)
        );

        this.appServer.get(
            this.basePaths + "acounts/ViewRedeemInvestements",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.GetUserRedeemInvestmentsController)
        );

        this.appServer.put(
            this.basePaths + "acounts/RiskManagement",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.PutUpdateRiskManagementController)
        );

        this.appServer.get(
            this.basePaths + "cryptos/ListCryptos",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.GetCryptosController)
        );

        this.appServer.put(
            this.basePaths + "cryptos/preferences",AuthMiddleware,
            makeCallback.buildControllerView(this.controllers.UpdateCryptoPreferenceController)
        );
        
    }

};