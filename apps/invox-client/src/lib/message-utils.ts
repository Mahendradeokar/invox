import { MessageStoreMessage } from "~/types/message";

export function getMessageDisplayText(message: MessageStoreMessage): string {
  const content = message.content;
  if (!content) return "";
  if (content.contentType === "text" && Array.isArray(content.parts)) {
    return content.parts.join(" ");
  }
  return "";
}
