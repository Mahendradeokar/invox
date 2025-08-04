import { SuccessResponse } from "./base";

export type GetAllTemplatesResponse =
  | {
      id: string;
      name: string;
      description: string;
      thumbnailUrl: string;
    }[]
  | [];
