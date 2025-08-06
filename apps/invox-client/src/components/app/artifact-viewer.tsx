import React from "react";

interface ArtifactViewerProps {
  src?: string;
  className?: string;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({
  src,
  className = "",
}) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <iframe
        src={src ?? "https://ui.shadcn.com/docs/components/tooltip"}
        className="w-full h-full border-0"
      />
    </div>
  );
};
