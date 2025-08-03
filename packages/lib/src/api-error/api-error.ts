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

    Error.captureStackTrace(this, this.constructor);
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

function makeError(status: number, code: string) {
  return function <M extends ErrorResponseMeta = ErrorResponseMeta>(
    detail: string = "",
    meta?: M
  ) {
    return new APIError(status, code, detail, meta);
  };
}

export const httpErrors = {
  badRequest: makeError(400, "bad_request"),
  unauthorized: makeError(401, "unauthorized"),
  forbidden: makeError(403, "forbidden"),
  notFound: makeError(404, "not_found"),
  conflict: makeError(409, "conflict"),
  unprocessable: makeError(422, "unprocessable_entity"),
  internal: makeError(500, "internal_server_error"),

  // For truly custom errors
  custom: (
    status: number,
    code: string,
    detail: string,
    meta: ErrorResponseMeta = {}
  ) => new APIError(status, code, detail, meta),
};
