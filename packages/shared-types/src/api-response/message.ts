export interface Message {
  anonId: string | object; // Reference to AnonUser
  projectId: string | object; // Reference to Project
  template: {
    id: string | object; // Reference to Document (template)
    templateContent: string;
    templateName: string;
  };
  meta?: Record<string, unknown>;
  content: {
    contentType: "text" | "html";
    parts: string[];
  };
  role: "assistant" | "user";
  createdAt: Date;
  updatedAt: Date;
}

export type GetProjectMessagesResponse = Message[] | [];
export type CreateMessageResponse = Message;
