import { ErrorResponseMeta } from "@repo/shared-types";

export class APIError<
  TMeta extends ErrorResponseMeta = ErrorResponseMeta,
> extends Error {
  status: number;
  code: string;
  detail: string;
  meta: TMeta;

  constructor(
    status: number,
    code: string,
    detail: string,
    meta: TMeta = {} as TMeta
  ) {
    super(detail);
    this.status = status;
    this.code = code;
    this.detail = detail;
    this.meta = meta;

    if (Error?.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toResponse(): {
    code: string;
    detail: string;
    meta: TMeta;
  } {
    return {
      code: this.code,
      detail: this.detail,
      meta: this.meta,
    };
  }
}

export type APIErrorClass = typeof APIError;

function makeError(status: number, code: string, defaultMessage: string = "") {
  return function <M extends ErrorResponseMeta = ErrorResponseMeta>(
    detail: string = defaultMessage,
    meta?: M
  ) {
    return new APIError(status, code, detail, meta);
  };
}

export const httpErrors = {
  badRequest: makeError(400, "bad_request", "Bad request"),
  unauthorized: makeError(401, "unauthorized", "Unauthorized"),
  forbidden: makeError(403, "forbidden", "Forbidden"),
  notFound: makeError(404, "not_found", "Not found"),
  conflict: makeError(409, "conflict", "Conflict"),
  unprocessable: makeError(422, "unprocessable_entity", "Unprocessable entity"),
  internal: makeError(500, "internal_server_error", "Internal server error"),

  // For truly custom errors
  custom: (
    status: number,
    code: string,
    detail: string,
    meta: ErrorResponseMeta = {}
  ) => new APIError(status, code, detail, meta),
};
