import { ApiClient } from "@repo/lib";
import axios, { AxiosRequestConfig } from "axios";
import ENV from "~/env";

class ClientAPI extends ApiClient {
  constructor() {
    const apiClient = axios.create({
      baseURL: `${ENV.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
    });

    super(apiClient);
  }

  // Override request middleware to add x-anon-id from cookies
  protected async requestMiddleware(config: AxiosRequestConfig) {
    let anonId = null;
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      anonId = cookieStore.get("_anonId");
    } catch {
      if (typeof document !== "undefined") {
        const match = document.cookie.match("(^|;)\\s*_anonId=([^;]+)");
        if (match) {
          anonId = { value: decodeURIComponent(match[2]) };
        }
      }
    }
    config.headers = config.headers || {};
    if (anonId) {
      config.headers["x-anon-id"] = anonId.value;
    }
    return config;
  }
}

export const API = new ClientAPI();
