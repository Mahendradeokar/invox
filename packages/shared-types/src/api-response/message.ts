export interface Message {
  anonId: string | object; // Reference to AnonUser
  projectId: string | object; // Reference to Project
  artifactId: string | object; // Reference to artifact
  meta?: Record<string, unknown>;
  content: {
    contentType: "text" | "html";
    parts: string[];
  };
  role: "assistant" | "user";
  createdAt: Date;
  updatedAt: Date;
  uiType: "text" | "error" | "placeholder";
  _id: string | object;
}

export type GetProjectMessagesResponse = Message[] | [];
export type CreateMessageResponse = Message;
