export type SuccessResponse<T> = T;

export type ErrorResponseMeta = Record<string, unknown>;

export interface ErrorResponse {
  code: string;
  detail: string;
  meta: ErrorResponseMeta;
}
