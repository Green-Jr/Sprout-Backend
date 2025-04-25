import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildGetUserInvestmentsController({ getCasesUserInvestments, }: { getCasesUserInvestments: any; }) {
    return async function GetUserInvestmentsController(httpRequest: HttpRequest, log: Logger) {
        try {
            return await getCasesUserInvestments(httpRequest, log);
        } catch (error) {
            return {
                statusCode: 400,
                body: error,
            };
        }
    };
}