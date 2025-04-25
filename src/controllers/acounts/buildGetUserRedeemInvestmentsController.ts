import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildGetUserRedeemInvestmentsController({ getCasesUserRedeemInvestments, }: { getCasesUserRedeemInvestments: any; }) {
    return async function GetUserRedeemInvestmentsController(httpRequest: HttpRequest, log: Logger) {
        try {
            return await getCasesUserRedeemInvestments(httpRequest, log);
        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    };
}