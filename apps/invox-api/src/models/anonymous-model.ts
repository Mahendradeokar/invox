import { Schema, model } from "mongoose";

export interface AnonUser {
  anon_id: string;
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
  },
  {
    collection: "anon_users",
    timestamps: true,
  }
);

export const AnonUserModel = model<AnonUser>("AnonUser", AnonUserSchema);
