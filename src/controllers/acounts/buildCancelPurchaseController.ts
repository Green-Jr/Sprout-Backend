import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildCancelPurchaseController({ postCancelPurchaseCase }: { postCancelPurchaseCase: any }) {
  return async function PostCancelPurchaseController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await postCancelPurchaseCase(httpRequest, log);
    } catch (error) {
      return {
        statusCode: 400,
        body: error,
      };
    }
  };
}
