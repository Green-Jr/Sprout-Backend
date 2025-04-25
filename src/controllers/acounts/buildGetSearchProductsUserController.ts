import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildSearchProductsUserController({ postSearchProductsUser }: { postSearchProductsUser: any }) {
  return async function SearchProductsUserController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await postSearchProductsUser(httpRequest, log);
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
