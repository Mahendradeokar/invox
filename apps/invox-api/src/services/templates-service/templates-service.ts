import { promises as fs } from "fs";
import * as path from "path";
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
      return config.map(this.processItem);
    } catch (err) {
      console.error("ERROR in getTemplates", err);
      return [];
    }
  }

  private processItem(item: TemplateConfigItem) {
    const API_URL = "http://localhost:5001";
    const resolveThumbnailPath = `${API_URL}/${item.thumbnailUrl}`;
    return {
      ...item,
      thumbnailUrl: resolveThumbnailPath,
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
    try {
      const fileData = await fs.readFile(meta.path, "utf-8");
      const fileJson = JSON.parse(fileData);
      return {
        ...meta,
        content: fileJson.content || "",
      };
    } catch {
      return null;
    }
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
