export interface Artifact {
  type: "html";
  name: string;
  content: string;
  metadata: {
    createdBy: string | object; // Reference to AnonUser
    sharedToken?: {
      token: string;
      createdAt?: Date;
    };
  };
  version: number;
  projectId: string | object;
  templateId: string;
  nodeType: "parent" | "child";
  baseArtifactId: `${string}-${string}`;
  parentId: string | object;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string | object;
}

export type GetArtifactResponse = Artifact;

export interface CreateArtifactShareLinkResponse {
  token: string;
}

export interface GetSharedArtifactResponse {
  content: string;
}
