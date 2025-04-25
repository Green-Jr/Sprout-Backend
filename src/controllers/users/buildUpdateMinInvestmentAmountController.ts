import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUpdateMinInvestmentAmountController({ UpdateMinInvestmentAmountUser }: { UpdateMinInvestmentAmountUser: any }) {
  return async function UpdateMinInvestmentAmountController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await UpdateMinInvestmentAmountUser(httpRequest, log);
    } catch (error) {
      return {
        statusCode: 500,
        body: {
          response: "Error in controller",
          message: (error as Error).message || "Unknown error",
        },
      };
    }
  };
}
