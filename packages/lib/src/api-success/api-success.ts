import { SuccessResponse } from "@repo/shared-types";

export const createResponse = <T>(data: T): SuccessResponse<T> => {
  /**
   * A single source for change the structure of the API Response
   */
  return data;
};
