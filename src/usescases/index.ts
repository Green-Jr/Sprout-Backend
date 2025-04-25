//Importar inyeccion de servicios
import { ServicesGateway } from "../services/index.services"

// Importar servicio de autenticasion
import buildAuthorizationCases from "./auth/buildCasesAuthorization";
import buildCasesPostOtpCodeNewUser from "./auth/buildCasesSendOtpBusinessAccount";
import buildCasesVerifyUserAndSendOtp from "./auth/buildCasesPostVerifyUserAndSendOtp";
import buildCasesVerifyOtpCode from "./auth/buildCasesVerifyOtpCode";

// Importar los casos de uso users
import buildCasesRegisterUser from "./users/buildCasesRegisterUser";
import buildCasesLoginAuth from "./users/buildCasesLoginUser";
import buildCaseGetUserProfile from "./users/buildCasesGetUserProfile";
import buildCasesUpdateMinInvestmentAmount from "./users/buildCasesUpdatePreferenceInvestementUser";

// Importar los casos de uso de cuentas
import buildCasesRechargeAccount from "./acounts/userAcounts/buildCasesRechargeUserAcount";
import buildCasesMakePurchase from "./acounts/purchases/buildCasesRegisterPurchase";
import buildCasesGetUserPurchasesCase from "./acounts/purchases/buildCasesGetPurchasesUser";
import buildCasesCancelPurchase from "./acounts/purchases/buildCasesCancelPurchase";
import buildCasesGetUserInvestments from "./acounts/investements/buildCasesGetUserInvestments";
import buildCasesRedeemSavings from "./acounts/userAcounts/buildCasesRedeemUserSavings";
import buildCasesRechargeSproutsCoinsAccount from "./acounts/sproutsCoins/buildCasesRechargeUserSproutsCoinsAcount";
import buildCasesRedeemSproutCoins from "./acounts/sproutsCoins/buildCasesRedeemUserSproutsCoins";
import buildCasesRedeemInvestment from "./acounts/investements/buildCasesRedeemUserInvestements";
import buildGetAllCryptosCase from "./acounts/userAcounts/buildCasesGetAllCryptos";
import buildUpdatePreferredCryptosCase from "./acounts/userAcounts/buildCasesUpdatePreferredCryptos";
import buildCasesUpdateRiskManagement from "./acounts/userAcounts/buildCasesUpdateRiskManagement";
import buildCasesRedeemHistory from "./acounts/investements/buildCasesGetReedemHistory";
import buildCasesSearchProducts from "./acounts/purchases/buildCasesSearchProducts";

// Crear instancia del caso de uso inyectando los servicios
// Autenticacion
const postAuthorizationCases = buildAuthorizationCases({services: ServicesGateway});
const postOtpCodeNewUser = buildCasesPostOtpCodeNewUser ({services: ServicesGateway});
const postVerifyUserAndSendOtp = buildCasesVerifyUserAndSendOtp ({services: ServicesGateway});
const postVerifyOtpCode = buildCasesVerifyOtpCode ({services: ServicesGateway});

// casos de uso de users
const postCasesRegisterUser = buildCasesRegisterUser({services: ServicesGateway});
const postCasesLoginAuth = buildCasesLoginAuth ({services: ServicesGateway});
const GetUserProfile = buildCaseGetUserProfile ({services: ServicesGateway});
const putCasesUpdateMinInvestmentAmount = buildCasesUpdateMinInvestmentAmount ({services: ServicesGateway});

// Casos de uso de cuentas
const postCasesRechargeAccount = buildCasesRechargeAccount({services: ServicesGateway});
const postCasesRechargeSproutsCoins = buildCasesRechargeSproutsCoinsAccount ({services: ServicesGateway});
const getCasesSearchProducts = buildCasesSearchProducts ({services: ServicesGateway});
const postCasesRegisterPurchseAccount =  buildCasesMakePurchase ({services: ServicesGateway});
const getCasesPurchasesUsers = buildCasesGetUserPurchasesCase ({services: ServicesGateway})
const postCasesCanceledPurchseAccount = buildCasesCancelPurchase ({services: ServicesGateway});
const getCasesUserInvestments = buildCasesGetUserInvestments ({services : ServicesGateway});
const postCasesRedeemSavingsAccount = buildCasesRedeemSavings ({services: ServicesGateway});
const postCasesRedeemSproutsCoins = buildCasesRedeemSproutCoins ({services: ServicesGateway});
const postCasesRedeemInvestements = buildCasesRedeemInvestment ({services: ServicesGateway});
const getCasesCryptos = buildGetAllCryptosCase ({services: ServicesGateway});
const postCasesUpdatePreferenceCryptos = buildUpdatePreferredCryptosCase ({services: ServicesGateway});
const putCasesUpdateRiskManagement = buildCasesUpdateRiskManagement ({services: ServicesGateway});
const getCasesRedeemHistory = buildCasesRedeemHistory ({services: ServicesGateway});

// Frezzear los casos de uso para evitar alteraciones no deseadas en los flujos
const UsesCases = Object.freeze({
    postAuthorizationCases,
    GetUserProfile,
    postOtpCodeNewUser,
    postVerifyUserAndSendOtp,
    postVerifyOtpCode,
    postCasesRegisterUser,
    postCasesLoginAuth,
    postCasesRechargeAccount,
    postCasesRechargeSproutsCoins,
    getCasesSearchProducts,
    postCasesRegisterPurchseAccount,
    getCasesPurchasesUsers,
    postCasesCanceledPurchseAccount,
    getCasesUserInvestments,
    postCasesRedeemSavingsAccount,
    postCasesRedeemSproutsCoins,
    postCasesRedeemInvestements,
    getCasesCryptos,
    postCasesUpdatePreferenceCryptos,
    putCasesUpdateMinInvestmentAmount,
    putCasesUpdateRiskManagement,
    getCasesRedeemHistory,
})

// Exportar casos de uso
export {
    postAuthorizationCases,
    GetUserProfile,
    postOtpCodeNewUser,
    postVerifyUserAndSendOtp,
    postVerifyOtpCode,
    postCasesLoginAuth,
    postCasesRegisterUser,
    postCasesRechargeAccount,
    postCasesRechargeSproutsCoins,
    getCasesSearchProducts,
    postCasesRegisterPurchseAccount,
    getCasesPurchasesUsers,
    postCasesCanceledPurchseAccount,
    getCasesUserInvestments,
    postCasesRedeemSavingsAccount,
    postCasesRedeemSproutsCoins,
    postCasesRedeemInvestements,
    getCasesCryptos,
    postCasesUpdatePreferenceCryptos,
    putCasesUpdateMinInvestmentAmount,
    putCasesUpdateRiskManagement,
    getCasesRedeemHistory,
}

export default UsesCases;