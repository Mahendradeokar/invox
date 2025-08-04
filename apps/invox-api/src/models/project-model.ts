import { Schema, model, Types } from "mongoose";

export interface Project {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  anonUser: Types.ObjectId;
  selectedTemplate: string;
  isDeleted: boolean;
  isActive: boolean;
}

const ProjectSchema = new Schema<Project>(
  {
    name: {
      type: String,
      required: true,
    },
    anonUser: {
      type: Schema.Types.ObjectId,
      ref: "AnonUser",
      required: true,
    },
    selectedTemplate: {
      type: String,
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
    collection: "projects",
    timestamps: true,
  }
);

export const ProjectModel = model<Project>("Project", ProjectSchema);
