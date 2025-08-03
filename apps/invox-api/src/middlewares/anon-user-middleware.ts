import { AnonUserModel } from "~/models/anonymous-model";
import { z } from "zod";
import { httpErrors } from "@repo/lib";
import { asyncWrapper } from "~/utils/async-wrapper";

const anonIdSchema = z.uuidv7();

export const ensureAnonUser = asyncWrapper(async (req, res, next) => {
  const anonId = req.header("x-anon-id");

  const parseResult = anonIdSchema.safeParse(anonId);

  if (!parseResult.success) {
    throw httpErrors.badRequest("Invalid or missing x-anon-id header");
  }

  const validAnonId = parseResult.data;

  const isExists = await AnonUserModel.exists({ anon_id: validAnonId });

  if (!isExists) {
    await AnonUserModel.create({ anon_id: validAnonId });
  }

  res.locals.anonId = validAnonId;

  next();
});
