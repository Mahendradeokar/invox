import React, { useRef } from "react";
import { ArtifactHeader } from "./artifact-header";
import { ArtifactViewer } from "./artifact-viewer";
import { useCurrantVisibleVersion } from "~/store/artifact-store";

export const Artifact = () => {
  const visibleVersionId = useCurrantVisibleVersion();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ArtifactHeader onPrint={handlePrint} />
      <div className="flex-1 min-h-0">
        <ArtifactViewer
          ref={iframeRef}
          key={visibleVersionId}
          artifactId={visibleVersionId}
          className="h-full"
        />
      </div>
    </div>
  );
};
