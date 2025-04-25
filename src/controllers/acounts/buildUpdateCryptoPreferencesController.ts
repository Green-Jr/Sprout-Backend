import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUpdateCryptoPreferenceController({ UpdateCryptoPreferenceUser }: { UpdateCryptoPreferenceUser: any }) {
  return async function UpdateCryptoPreferenceController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await UpdateCryptoPreferenceUser(httpRequest, log);
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
