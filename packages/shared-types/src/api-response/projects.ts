import { Artifact } from "./artifact";
import { Message } from "./message";
import { Template } from "./templates";

export interface Project {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  anonUser: string | Object;
  selectedTemplate: string;
  templatedMeta: Template;
  _id: string | object;
}

export type GetProjectsResponse = {
  projects: Project[];
  meta: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
};

export type CreateProjectResponse = Project;

export type GetInitialProjectData = {
  id: string;
  project: Project;
  messages: Message[];
  latestArtifact: Artifact | null;
};
