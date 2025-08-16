import { Message, SetRequired } from "@repo/shared-types";

export interface StoreMessageItem extends Message {
  tempId: string;
}

export type MessageStoreMessage = SetRequired<
  Partial<StoreMessageItem>,
  "content" | "role" | "uiType" | "tempId"
>;
