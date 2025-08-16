import { SuccessResponse } from "./base";

export type Template = {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
};

export type GetAllTemplatesResponse = Template[];
