import { Schema, model, Types } from "mongoose";

export interface Message {
  anonId: Types.ObjectId; // Reference to AnonUser
  projectId: Types.ObjectId; // Reference to Project
  artifactId: Types.ObjectId;
  meta?: Record<string, unknown>;
  content: {
    contentType: "text" | "html";
    parts: string[];
  };
  role: "assistant" | "user";
  uiType: "text" | "error" | "placeholder";
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
    artifactId: {
      type: Schema.ObjectId,
      ref: "Artifact",
      require: true,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
    content: {
      contentType: {
        type: String,
        enum: ["text"],
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
    uiType: {
      type: String,
      enum: ["text", "error", "placeholder"],
      required: true,
      default: "text",
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
