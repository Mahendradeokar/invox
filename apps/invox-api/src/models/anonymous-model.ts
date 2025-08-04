import { Schema, model } from "mongoose";

export interface AnonUser {
  anon_id: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnonUserSchema = new Schema<AnonUser>(
  {
    anon_id: {
      type: String,
      required: true,
      unique: true,
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
    collection: "anon_users",
    timestamps: true,
  }
);

export const AnonUserModel = model<AnonUser>("AnonUser", AnonUserSchema);
