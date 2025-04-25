// Importar los casos de uso
import {
    postAuthorizationCases, postOtpCodeNewUser,
    postCasesRegisterUser, GetUserProfile,
    postVerifyUserAndSendOtp, postVerifyOtpCode,
    postCasesLoginAuth, postCasesRechargeAccount,
    postCasesRegisterPurchseAccount, postCasesCanceledPurchseAccount,
    postCasesRedeemSavingsAccount, postCasesRechargeSproutsCoins,
    postCasesRedeemSproutsCoins, postCasesRedeemInvestements,
    getCasesUserInvestments, getCasesPurchasesUsers,
    getCasesCryptos, postCasesUpdatePreferenceCryptos,
    putCasesUpdateMinInvestmentAmount, putCasesUpdateRiskManagement,
    getCasesRedeemHistory, getCasesSearchProducts,
} from "../usescases/index"

// Importar los controladores 
import buildAuthorizationController from "./auth/UserAuthController";
import buildPostOtpNewUserController from "./auth/PostOtpNewUserController";
import buildUserRegisterController from "./users/buildUserRegisterController";
import buildPostOtpUserController from "./auth/PostOtpUserController";
import buildPostValidOtpUserController from "./auth/PostValidOtpUserController";
import buildUserLoginAuthController from "./users/buildUserLoginAuthController";
import buildUserProfileController from "./users/buildUserProfileController";
import buildUserRechargeAccountController from "./acounts/buildRechargeAccountUserController";
import buildUserRechargeSproutsCoinsAccountController from "./acounts/buildRechargeSproutsCoinsAccountUserController";
import buildSearchProductsUserController from "./acounts/buildGetSearchProductsUserController";
import buildMakePurchaseController from "./acounts/buildMakePurchaseUserController";
import buildGetPurchaseController from "./acounts/buildGetPurchaseUserController";
import buildCancelPurchaseController from "./acounts/buildCancelPurchaseController";
import buildUserRedeemSavingsController from "./acounts/buildUserRedeemSavingsController";
import buildUserRedeemSproutsCoinsController from "./acounts/buildUserRedeemSproutsCoinsController";
import buildUserRedeemInvestementsController from "./acounts/buildUserRedeemInvestementsController";
import buildGetUserInvestmentsController from "./acounts/buildGetUserInvestmentsController";
import buildGetCryptosController from "./acounts/buildGetCryptosController";
import buildUpdateCryptoPreferenceController from "./acounts/buildUpdateCryptoPreferencesController";
import buildUpdateMinInvestmentAmountController from "./users/buildUpdateMinInvestmentAmountController";
import buildUpdateRiskManagementController from "./acounts/buildUpdateUpdateRiskManagementController";
import buildGetUserRedeemInvestmentsController from "./acounts/buildGetUserRedeemInvestmentsController";

const PostAuthorizationController = buildAuthorizationController({getCasesAuthorization: postAuthorizationCases});
const PostOtpNewUserController = buildPostOtpNewUserController ({postCasesOtpNewUser: postOtpCodeNewUser});
const PostRegisterUserController = buildUserRegisterController({postCasesUserRegister: postCasesRegisterUser});
const PostOtpUserController = buildPostOtpUserController({postCasesOtpUser:postVerifyUserAndSendOtp});
const PostValidOtpUserController =  buildPostValidOtpUserController ({postCasesValidOtpUser: postVerifyOtpCode });
const PostLoginAuthController = buildUserLoginAuthController ({postCasesUserLoginAuth: postCasesLoginAuth});
const GetUserProfileController = buildUserProfileController ({postCasesUserProfile: GetUserProfile});
const PostRechargeAccountController = buildUserRechargeAccountController({postCasesRechargeAccount: postCasesRechargeAccount});
const PostRechargeSproutsCoinsAccountController = buildUserRechargeSproutsCoinsAccountController ({postCasesRechargeSproutsCoinsAccount: postCasesRechargeSproutsCoins });
const GetSearchProductsUserController = buildSearchProductsUserController ({postSearchProductsUser: getCasesSearchProducts});
const PostRegisterPurchaseController =  buildMakePurchaseController ({postMakePurchase: postCasesRegisterPurchseAccount });
const GetPurchaseUsersController = buildGetPurchaseController ({GetPurchaseUser: getCasesPurchasesUsers });
const PostCancelPurchaseController = buildCancelPurchaseController ({postCancelPurchaseCase: postCasesCanceledPurchseAccount});
const PostRedeemSavingsController = buildUserRedeemSavingsController ({postCasesRedeemSavings: postCasesRedeemSavingsAccount });
const PostRedeemSproutsCoinsController = buildUserRedeemSproutsCoinsController ({postCasesRedeemSproutsCoins: postCasesRedeemSproutsCoins});
const PostRedeemInvestementsController = buildUserRedeemInvestementsController ({postCasesRedeemInvestements: postCasesRedeemInvestements});
const GetUserInvestemetsController = buildGetUserInvestmentsController ({getCasesUserInvestments: getCasesUserInvestments});
const GetCryptosController = buildGetCryptosController ({GetCryptosUser: getCasesCryptos});
const UpdateCryptoPreferenceController = buildUpdateCryptoPreferenceController ({UpdateCryptoPreferenceUser: postCasesUpdatePreferenceCryptos});
const PutUpdateMinInvestmentAmountController = buildUpdateMinInvestmentAmountController ({UpdateMinInvestmentAmountUser: putCasesUpdateMinInvestmentAmount});
const PutUpdateRiskManagementController = buildUpdateRiskManagementController ({UpdateRiskManagementUser: putCasesUpdateRiskManagement});
const GetUserRedeemInvestmentsController = buildGetUserRedeemInvestmentsController ({getCasesUserRedeemInvestments : getCasesRedeemHistory});


const controllers = Object.freeze({

    PostAuthorizationController,
    PostOtpNewUserController,
    PostRegisterUserController,
    PostOtpUserController,
    PostValidOtpUserController,
    PostLoginAuthController,
    GetUserProfileController,
    PostRechargeAccountController,
    PostRechargeSproutsCoinsAccountController,
    GetSearchProductsUserController,
    PostRegisterPurchaseController,
    GetPurchaseUsersController,
    PostCancelPurchaseController,
    PostRedeemSavingsController,
    PostRedeemSproutsCoinsController,
    PostRedeemInvestementsController,
    GetUserInvestemetsController,
    GetCryptosController,
    UpdateCryptoPreferenceController,
    PutUpdateMinInvestmentAmountController,
    PutUpdateRiskManagementController,
    GetUserRedeemInvestmentsController,
});

// Exportar los controladores
export {
    PostAuthorizationController,
    PostOtpNewUserController,
    PostRegisterUserController,
    PostOtpUserController,
    PostValidOtpUserController,
    PostLoginAuthController,
    GetUserProfileController,
    PostRechargeAccountController,
    PostRechargeSproutsCoinsAccountController,
    PostRegisterPurchaseController,
    GetSearchProductsUserController,
    GetPurchaseUsersController,
    PostCancelPurchaseController,
    PostRedeemSavingsController,
    PostRedeemSproutsCoinsController,
    PostRedeemInvestementsController,
    GetUserInvestemetsController,
    GetCryptosController,
    UpdateCryptoPreferenceController,
    PutUpdateMinInvestmentAmountController,
    PutUpdateRiskManagementController,
    GetUserRedeemInvestmentsController,
}

export default controllers;