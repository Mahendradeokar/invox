import { Message } from "@repo/shared-types";
import { modelMessageSchema } from "ai";
import z from "zod";

const templateSelectionMessages = [
  "Selected {templateName}.",
  "Picked {templateName}.",
  "Using {templateName}.",
  "Chose {templateName}.",
  "{templateName} selected.",
  "Started with {templateName}.",
  "Began with {templateName}.",
  "Working with {templateName}.",
  "Ready with {templateName}.",
  "Chosen {templateName}.",
  "Now using {templateName}.",
];

const aiTemplateSelectionMessage = [
  "Great choice! You can now customize your {templateType} using AI. Type your instructions below to begin. For example, you can ask to add, remove, or modify sections, or request specific content changes.",
  "Nice pick! Your {templateType} is ready for customization with AI. Just type what you want to change, add, or remove below.",
  "Awesome! You can now personalize your {templateType} with AI. Type your requests below, like adding sections, changing content, or removing elements.",
  "Template ready! Use AI to make changes to your {templateType}. Add, remove, or edit sections by typing your instructions below.",
  "Perfect! You can now tweak your {templateType} with AI. Ask to adjust sections, modify wording, or add new content.",
  "Great! AI is ready to help you customize your {templateType}. Just type what you’d like to add, edit, or remove.",
  "Your template is set! Use AI to customize it—type your ideas below to add, remove, or modify content.",
  "Good choice! You can now edit your {templateType} with AI. For example, request a new section, remove one, or update existing details.",
  "All set! AI can now help you shape your {templateType}. Just type your customization requests below.",
  "Ready to go! You can use AI to adjust your {templateType}—ask to add, delete, or change any part you like.",
];

export function getTemplateSelectionMessage(templateName: string) {
  const randomIndex = Math.floor(
    Math.random() * templateSelectionMessages.length
  );
  return templateSelectionMessages[randomIndex].replace(
    "{templateName}",
    templateName
  );
}

export function getAIsTemplateSelectionMessage(templateName: string) {
  const randomIndex = Math.floor(
    Math.random() * aiTemplateSelectionMessage.length
  );
  return aiTemplateSelectionMessage[randomIndex].replace(
    "{templateType}",
    templateName
  );
}

export function convertToAISDKMessages(
  messages: Pick<Message, "content" | "role">[]
): z.infer<typeof modelMessageSchema>[] {
  return messages.map((message) => ({
    role: message.role,
    content: Array.isArray(message.content?.parts)
      ? message.content.parts.map((text: string) => ({
          type: "text",
          text,
        }))
      : typeof message.content === "string"
        ? [{ type: "text", text: message.content }]
        : [],
  }));
}
