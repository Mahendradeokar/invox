"use client";

import React, { useEffect, useState } from "react";
import { getArtifact } from "~/lib/requests/artifact";
import { useArtifactActions, useArtifactStore } from "~/store/artifact-store";
import { Loading } from "../shared";
import { cn } from "~/lib/utils";

interface ArtifactViewerProps {
  className?: string;
  artifactId: string | null;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({
  artifactId,
  className,
}) => {
  const artifactState = useArtifactStore(
    (state) => state.artifacts[artifactId ?? "NONE"]
  );
  const { addArtifact } = useArtifactActions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      const isArtifactExists =
        !!artifactId && useArtifactStore.getState().artifacts[artifactId];

      if (isArtifactExists && artifactId) {
        setLoading(false);
        return;
      }

      if (!artifactId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await getArtifact(artifactId);
      if (error) {
        setError(error.detail);
        setLoading(false);
        return;
      }

      addArtifact(data);
      setLoading(false);
    }

    fetchInvoice();
  }, [artifactId, addArtifact]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  if (!artifactState) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-gray-500 text-center">No invoice found.</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-1", className)}>
      <iframe
        sandbox="allow-same-origin allow-scripts allow-popups"
        srcDoc={artifactState.content}
        className="w-full border-none"
      />
    </div>
  );
};
