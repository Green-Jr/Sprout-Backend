import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildMakePurchaseController({ postMakePurchase }: { postMakePurchase: any }) {
  return async function MakePurchaseController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await postMakePurchase(httpRequest, log);
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
