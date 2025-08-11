import { tryCatch } from "@repo/lib";
import { promises as fs } from "fs";
import * as path from "path";
import env from "~/env";
import { resolveAppRoot } from "~/utils/path";

// Using the strategy pattern allows easy swapping of template sources like from local to db.

export interface TemplateConfigItem {
  id: string;
  name: string;
  description: string;
  content: string;
  path: string;
  thumbnailUrl: string;
}

export type TemplateConfig = TemplateConfigItem[];
// export type Template = Omit<TemplateConfigItem, "path">;

export interface TemplateRepository {
  getTemplates(): Promise<TemplateConfig>;
  findTemplate(id: string): Promise<TemplateConfigItem | null>;
}

class LocalTemplateRepository implements TemplateRepository {
  private templatesDir: string;
  private configFile: string;

  constructor(
    templatesDir: string = resolveAppRoot("/assets/invoice-templates")
  ) {
    this.templatesDir = templatesDir;
    this.configFile = path.join(this.templatesDir, "template.json");
  }

  private async getAllTemplates() {
    try {
      const data = await fs.readFile(this.configFile, "utf-8");
      const config: TemplateConfig = JSON.parse(data);
      const resolvedContent = await Promise.all(
        config.map((item) => tryCatch(this.processItem(item)))
      );

      console.log(resolvedContent);
      console.log(resolvedContent.filter((item) => !item.error));
      return resolvedContent
        .filter((item) => !item.error)
        .map((item) => item.data);
    } catch (err) {
      console.error("ERROR in getTemplates", err);
      return [];
    }
  }

  private async processItem(item: TemplateConfigItem) {
    const resolveThumbnailPath = new URL(
      item.thumbnailUrl,
      env.API_BASE_URL
    ).toString();

    // fetch html content
    const htmlContent =
      (await fs.readFile(item.path, "utf8").catch(() => null)) ?? "No Content";
    return {
      ...item,
      thumbnailUrl: resolveThumbnailPath,
      content: htmlContent,
    };
  }

  async getTemplates() {
    try {
      const config = await this.getAllTemplates();
      return config;
    } catch (err) {
      console.error("ERROR in getTemplates", err);
      return [];
    }
  }

  async findTemplate(id: string) {
    const templates = await this.getTemplates();
    const meta = templates.find((t) => t.id === id);
    if (!meta || !meta.path) return null;
    return meta;
  }
}

export function createTemplateRepository(
  strategy: "local"
): TemplateRepository {
  switch (strategy) {
    case "local":
      return new LocalTemplateRepository();
    default:
      return new LocalTemplateRepository();
  }
}
