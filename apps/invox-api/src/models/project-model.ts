import { Schema, model, Types } from "mongoose";

export interface Project {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  anonUser: string;
  selectedTemplate: string;
}

const ProjectSchema = new Schema<Project>(
  {
    name: {
      type: String,
      required: true,
    },
    anonUser: {
      type: String,
      ref: "AnonUser",
      required: true,
    },
    selectedTemplate: {
      type: String,
      required: true,
    },
  },
  {
    collection: "projects",
    timestamps: true,
  }
);

export const ProjectModel = model<Project>("Project", ProjectSchema);
