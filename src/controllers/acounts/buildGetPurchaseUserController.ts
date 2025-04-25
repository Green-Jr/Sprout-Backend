import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildGetPurchaseController({ GetPurchaseUser }: { GetPurchaseUser: any }) {
  return async function GetPurchaseController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await GetPurchaseUser(httpRequest, log);
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
