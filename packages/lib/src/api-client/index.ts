import { ErrorResponse } from "@repo/shared-types";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { tryCatch } from "../utils";

type Method = "get" | "post" | "put" | "patch" | "delete";

export class ApiClient {
  protected client: AxiosInstance;

  constructor(fetcher: AxiosInstance) {
    this.client = fetcher;

    this.client.interceptors.request.use(
      this.requestMiddleware.bind(this) as () =>
        | Promise<InternalAxiosRequestConfig>
        | InternalAxiosRequestConfig,
      this.requestErrorMiddleware.bind(this)
    );

    this.client.interceptors.response.use(
      this.responseMiddleware.bind(this),
      this.responseErrorMiddleware.bind(this)
    );
  }

  /**
   * Request middleware - can be overridden in subclasses
   */
  protected async requestMiddleware(config: AxiosRequestConfig) {
    // const { get } = await cookies();
    // config.headers = config.headers || {};
    // config.headers["x-anon-id"] = get("_anonId");
    return config;
  }

  /**
   * Request error middleware - can be overridden in subclasses
   */
  protected requestErrorMiddleware(error: unknown) {
    return Promise.reject(error);
  }

  /**
   * Response middleware - can be overridden in subclasses
   */
  protected responseMiddleware(response: AxiosResponse) {
    return response;
  }

  /**
   * Response error middleware - can be overridden in subclasses
   */
  protected responseErrorMiddleware(error: unknown) {
    return Promise.reject(error);
  }

  public static isApiClientError(e: unknown) {
    return axios.isAxiosError<ErrorResponse>(e);
  }

  public async makeRequest<R = unknown, P = unknown>(
    method: Method,
    url: string,
    payload?: P,
    options?: AxiosRequestConfig
  ): Promise<
    { data: R; error?: never } | { data?: never; error: ErrorResponse }
  > {
    const axiosMethod = this.client[method].bind(this.client);

    const { data: response, error } = await tryCatch(
      method === "get" || method === "delete"
        ? axiosMethod(url, options)
        : axiosMethod(url, payload, options)
    );

    if (!error) {
      return { data: response.data as R };
    }

    if (ApiClient.isApiClientError(error) && error.response?.data?.code) {
      return { error: error.response?.data };
    }

    throw error;
  }
}
