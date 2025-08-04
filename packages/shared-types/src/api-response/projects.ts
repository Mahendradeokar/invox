interface Project {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  anonUser: string | Object;
  selectedTemplate: string;
}

export type GetProjectsResponse = Project[] | [];
export type CreateProjectResponse = Project;
