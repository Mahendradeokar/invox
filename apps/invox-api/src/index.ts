import mongoose from "mongoose";
import {
  ensureAnonUser,
  errorHandler,
  perIpLimiter,
  perUserLimiter,
} from "./middlewares";
import { createServer } from "./server";
import express from "express";
import router from "./routes";
import { asyncWrapper } from "./utils/async-wrapper";
import { sendTemplateImage } from "./modules/invox-templates";
import { httpErrors, tryCatch } from "@repo/lib";
// import { generateAndInsertDummyProjects } from "./dummyData";

import ENV from "./env";
import { resolveAppRoot } from "./utils/path";
import { initKeepAliveCron } from "./crons";

const port = ENV.PORT || 5001;
const server = createServer();

server.use("/api", ensureAnonUser, perIpLimiter, perUserLimiter, router);
server.get("/cdn/t/:file", asyncWrapper(sendTemplateImage));
server.use("/cdn/assets", express.static(resolveAppRoot("/assets/public")));

// ----------------------------------------------------------------------
// IGNORE THIS IT'S RELATED TO DEPLOYMENT
server.get("/keep-alive", async (req, res) => {
  res.status(200).json({ status: "Okay" });
});
// ---------------------------------------------------------------------

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
  const { error } = await tryCatch(
    mongoose.connect(`${ENV.MONGODB_URL}/${ENV.DB_NAME}`)
  );

  if (error) {
    console.error("❌ Failed to connect to DB. Please check your db url");
    process.exit(1);
  }

  // INSERT_YOUR_CODE - Don't use this
  // if (ENV.INIT_WITH_DUMMY_DATA && ENV.INIT_WITH_DUMMY_DATA !== "0") {
  //   const { ProjectModel } = await import("./models/project-model");
  //   const { AnonUserModel } = await import("./models/anonymous-model");

  //   const anonUser = "ae7fdd91-65d5-4a46-a461-69455db86893";

  //   const anonUserObject = await AnonUserModel.findOne({
  //     anon_id: anonUser,
  //   }).lean();

  //   if (!anonUserObject) {
  //     return;
  //   }

  //   const existingCount = await ProjectModel.find({
  //     anonUser: anonUserObject._id,
  //   }).countDocuments();

  //   if (existingCount === 20) {
  //     await generateAndInsertDummyProjects(100, anonUserObject._id.toString());
  //     console.log("✅ Inserted dummy projects");
  //   }
  // }

  server.listen(port, () => {
    console.log(`api running on ${port}`);
    // ---------------------------------------------------------
    // IGNORE IT IT"S DEPLOYMENT RELATED
    initKeepAliveCron();
    // ---------------------------------------------------------
  });

  const cleanUpFn = async (err?: unknown) => {
    if (err) {
      console.error("Cleanup due to error:", err);
    }
    await mongoose.disconnect();
    process.exit(0);
  };

  process.on("unhandledRejection", async (reason) => {
    console.log("process.on('unhandledRejection') called with reason:", reason);
    await cleanUpFn(reason);
  });

  process.on("uncaughtException", async (err) => {
    console.log("process.on('uncaughtException') called with error:", err);
    await cleanUpFn(err);
  });
})();
