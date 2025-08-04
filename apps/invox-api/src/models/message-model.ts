import { Schema, model, Types } from "mongoose";

export interface Message {
  anonId: Types.ObjectId; // Reference to AnonUser
  projectId: Types.ObjectId; // Reference to Project
  template: {
    id: Types.ObjectId; // Reference to Document (template)
    templateContent: string;
    templateName: string;
  };
  meta?: Record<string, unknown>;
  content: {
    contentType: "text" | "html";
    parts: string[];
  };
  role: "assistant" | "user";
  isDeleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<Message>(
  {
    anonId: {
      type: Schema.Types.ObjectId,
      ref: "AnonUser",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    template: {
      id: {
        type: String,
        // ref: "Document",
        required: true,
      },
      templateContent: {
        type: String,
        required: true,
      },
      templateName: {
        type: String,
        required: true,
      },
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
    content: {
      contentType: {
        type: String,
        enum: ["text", "html"],
        required: true,
      },
      parts: {
        type: [String],
        required: true,
        default: [],
      },
    },
    role: {
      type: String,
      enum: ["assistant", "user"],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

export const MessageModel = model<Message>("Message", MessageSchema);
