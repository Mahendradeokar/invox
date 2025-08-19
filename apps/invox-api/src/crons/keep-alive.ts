import env from "../env";
import cron from "node-cron";

const keepAliveUrl = `${env.API_BASE_URL}/keep-alive`;

const pingKeepAlive = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch(keepAliveUrl, { signal: controller.signal });
    clearTimeout(timeout);
  } catch (err) {
    console.error("Keep-alive ping failed:", err);
  }
};

export function initKeepAliveCron() {
  if (process.env.NODE_ENV === "production") {
    cron.schedule("*/10 * * * *", pingKeepAlive);
  }
}
