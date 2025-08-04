import mongoose from "mongoose";
import { ensureAnonUser, errorHandler } from "./middlewares";
import { createServer } from "./server";
import router from "./routes";
import { asyncWrapper } from "./utils/async-wrapper";
import { sendTemplateImage } from "./modules/invox-templates";
import { httpErrors, tryCatch } from "@repo/lib";
import ENV from "./env";

const port = ENV.PORT || 5001;
const server = createServer();

server.use("/api", ensureAnonUser, router);
server.get("/cdn/t/:file", ensureAnonUser, asyncWrapper(sendTemplateImage));

// ----------------------------------------------------------------------
// No found route handler
server.use(() => {
  throw httpErrors.notFound();
});

/**
 * Error handling middleware
 */
server.use(errorHandler);

(async () => {
  console.log(`${ENV.MONGODB_URL}/${ENV.DB_NAME}`);
  const { error } = await tryCatch(
    mongoose.connect(`${ENV.MONGODB_URL}/${ENV.DB_NAME}`)
  );

  if (error) {
    console.error("❌ Failed to connect to DB. Please check your db url");
    process.exit(1);
  }
  server.listen(port, () => {
    console.log(`api running on ${port}`);
  });

  process.on("SIGINT", async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
})();
