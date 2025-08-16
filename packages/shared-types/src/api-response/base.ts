export type SuccessResponse<T> = T;

export type ErrorResponseMeta = Record<string, unknown>;

// List of possible error codes from @api-error.ts
export type ErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "unprocessable_entity"
  | "internal_server_error"
  | (string & {});

export interface ErrorResponse {
  code: ErrorCode;
  detail: string;
  meta: ErrorResponseMeta;
}
