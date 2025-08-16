import { createTemplateRepository } from "~/services/templates-service";
import { createResponse, httpErrors, tryCatch } from "@repo/lib";
import path from "path";
import { resolveAppRoot } from "~/utils/path";
import fs from "fs";
import { AsyncHandler } from "~/types";
import { GetAllTemplatesResponse } from "@repo/shared-types";

const invoiceTemplatesPath = resolveAppRoot(
  path.join("assets", "invoice-templates")
);

const templatesRepo = createTemplateRepository("local");

export const getAllTemplates: AsyncHandler = async (req, res) => {
  const templates = await templatesRepo.getTemplates();
  return res
    .status(200)
    .json(createResponse<GetAllTemplatesResponse>(templates));
};

export const sendTemplateImage: AsyncHandler = async (req, res) => {
  const file = req.params.file;

  if (!/^[\w-]+\.png$/.test(file)) {
    return res.status(403).send("Forbidden");
  }

  const filePath = path.join(invoiceTemplatesPath, file);
  const isFileExists = new Promise<string>((resolve, reject) => {
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) return reject("Not Found");
      resolve(filePath);
    });
  });

  const { data, error } = await tryCatch(isFileExists);
  if (error) {
    throw httpErrors.notFound(error.message);
  }

  res.sendFile(data);
};
