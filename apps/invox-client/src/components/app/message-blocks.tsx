import React from "react";
import {
  useCurrantVisibleVersion,
  useArtifactActions,
} from "~/store/artifact-store";
import { cn } from "~/lib/utils";
import { FileText } from "lucide-react";
import { Artifact } from "@repo/shared-types";

interface ArtifactMessageBlockProps {
  artifactId: string;
  artifact: Artifact | null;
}

export const ArtifactMessageBlock: React.FC<ArtifactMessageBlockProps> = ({
  artifactId,
  artifact,
}) => {
  const currantVisibleVersion = useCurrantVisibleVersion();
  const { setCurrantVisibleVersion } = useArtifactActions();
  const isActive = currantVisibleVersion === artifactId;

  return (
    <button
      type="button"
      onClick={() => {
        if (!isActive) setCurrantVisibleVersion(artifactId);
      }}
      className={cn(
        "flex items-center gap-2 px-2 py-2 mt-1 rounded border text-xs max-w-[200px] w-[90%] transition-colors select-none h-10",
        isActive
          ? "border-primary bg-primary/10 cursor-default"
          : "border-muted bg-muted/30 hover:border-primary hover:bg-primary/10 active:border-primary active:bg-primary/10 cursor-pointer"
      )}
      style={{ minWidth: 0 }}
      tabIndex={0}
      aria-current={isActive ? "true" : undefined}
      title={
        isActive
          ? "Currently visible in the right side"
          : "Preview in right side"
      }
    >
      <span className="rounded bg-primary/10 p-1 flex-shrink-0 flex items-center justify-center">
        <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
      </span>
      <span
        className="flex-1 min-w-0 flex items-center"
        style={{
          maxWidth: "120px",
          display: "block",
        }}
        title={
          (artifact?.name || "Updated Invoice") +
          (artifact?.version ? ` (v${artifact.version})` : "")
        }
      >
        <span className="truncate">{artifact?.name || "Updated Invoice"}</span>
        <span className="ml-1 text-muted-foreground text-[12px] align-middle flex-shrink-0">
          v{artifact?.version ?? 0}
        </span>
      </span>
    </button>
  );
};
