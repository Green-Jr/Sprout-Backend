import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildGetCryptosController({ GetCryptosUser }: { GetCryptosUser: any }) {
  return async function GetCryptosController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await GetCryptosUser(httpRequest, log);
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
