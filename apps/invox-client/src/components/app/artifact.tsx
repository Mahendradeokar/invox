import React from "react";
import { ArtifactHeader } from "./artifact-header";
import { ArtifactViewer } from "./artifact-viewer";
import {
  useVersionList,
  useArtifactActions,
  useCurrantVisibleVersion,
} from "~/store/artifact-store";
import type { ArtifactVersionAction } from "~/types/artifact";
import { useProject } from "~/store/project-store";

interface ArtifactProps {
  selectedArtifactId: string | null;
  templateTitle: string | null;
}

export const Artifact: React.FC<ArtifactProps> = () => {
  const visibleVersionId = useCurrantVisibleVersion();

  return (
    <div className="flex flex-col h-full">
      <ArtifactHeader />
      <div className="flex-1 min-h-0">
        <ArtifactViewer
          key={visibleVersionId}
          artifactId={visibleVersionId}
          className="h-full"
        />
      </div>
    </div>
  );
};
