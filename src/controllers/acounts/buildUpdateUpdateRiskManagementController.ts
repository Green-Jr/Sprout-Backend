import { HttpRequest } from "../../utils/types/types";
import { Logger } from "../../utils/interface/logger.interface";

export default function buildUpdateRiskManagementController({ UpdateRiskManagementUser }: { UpdateRiskManagementUser: any }) {
  return async function UpdateRiskManagementController(httpRequest: HttpRequest, log: Logger) {
    try {
      return await UpdateRiskManagementUser(httpRequest, log);
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
