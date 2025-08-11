interface Project {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  anonUser: string | Object;
  selectedTemplate: string;
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
