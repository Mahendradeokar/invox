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

export interface DownloadArtifactArchiveResponse {
  /**
   * The name of the file to be downloaded (e.g., "artifact-1234.zip").
   */
  filename: string;
  /**
   * The MIME type of the archive (e.g., "application/zip").
   */
  contentType: string;
  /**
   * The archive file as an ArrayBuffer, base64-encoded string, or null if not available.
   * The actual type may depend on the transport (e.g., REST, GraphQL, etc.).
   */
  data: ArrayBuffer | string | null;
}

