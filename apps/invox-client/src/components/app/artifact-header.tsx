import React from "react";
import {
  Download,
  Share,
  Info,
  CornerUpRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ArtifactVersionAction } from "~/types/artifact";
import { ArtifactSharePopover } from "./artifact-share";
import { Ternary } from "../shared";
import {
  useArtifactActions,
  useArtifacts,
  useCurrantVisibleVersion,
  useSelectedArtifactId,
  useVersionList,
} from "~/store/artifact-store";
import { useProject } from "~/store/project-store";
import { Condition } from "../shared/condition";
import { downloadArtifactArchive } from "~/lib/requests/artifact";
import { toast } from "sonner";

const AlertInfoStrip: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className = "" }) => (
  <div
    className={`flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-800 text-sm border border-blue-200 ${className}`}
    role="alert"
  >
    <Info className="w-4 h-4 text-blue-500" aria-hidden="true" />
    <span>{message}</span>
  </div>
);

// Common Tooltip wrapper for buttons and actions
const WithTooltip: React.FC<{
  content: React.ReactNode;
  children: React.ReactNode;
}> = ({ content, children }) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent>{content}</TooltipContent>
  </Tooltip>
);

interface ArtifactHeaderProps {
  onPrint: () => void;
}

export const ArtifactHeader: React.FC<ArtifactHeaderProps> = ({ onPrint }) => {
  const selectedArtifactId = useSelectedArtifactId();
  const visibleVersionId = useCurrantVisibleVersion();
  const artifacts = useArtifacts();
  const project = useProject();
  const versionList = useVersionList();

  const { setSelectedArtifactId, setCurrantVisibleVersion } =
    useArtifactActions();

  const visibleIndex = visibleVersionId
    ? versionList.findIndex((id) => id === visibleVersionId)
    : -1;

  const isFirstVersion = visibleIndex === 0;
  const isLastVersion =
    visibleIndex === versionList.length - 1 && visibleIndex !== -1;
  const isSelectedVersion = visibleVersionId === selectedArtifactId;

  const handleGoToVersion = (action: ArtifactVersionAction) => {
    if (!versionList.length || visibleIndex === -1) return;

    if (action === "previous" && visibleIndex > 0) {
      setCurrantVisibleVersion(versionList[visibleIndex - 1]);
    } else if (action === "next" && visibleIndex < versionList.length - 1) {
      setCurrantVisibleVersion(versionList[visibleIndex + 1]);
    } else if (action === "latest") {
      setCurrantVisibleVersion(versionList[versionList.length - 1]);
    } else if (action === "selected") {
      setCurrantVisibleVersion(selectedArtifactId);
    }
  };

  const handleDownload = async () => {
    if (!visibleVersionId) return;
    const { data, error } = await downloadArtifactArchive(visibleVersionId);
    if (error) {
      toast.error(error.detail || "Failed to download artifact");
      return;
    }

    const blob = data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `artifact-${visibleVersionId}.zip`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  };

  const handleSelectEditAI = () => {
    if (
      visibleVersionId &&
      visibleVersionId !== selectedArtifactId &&
      versionList.includes(visibleVersionId)
    ) {
      setSelectedArtifactId(visibleVersionId);
    }
  };

  const getIconDisabledClass = (disabled: boolean) =>
    disabled ? "opacity-40 text-muted-foreground" : "";

  return (
    <>
      <header
        role="artifact-view-header"
        className="h-13 flex px-4 items-center justify-between border-b shadow-xs inset-shadow-xs"
      >
        <div className="flex gap-1 items-baseline max-w-lg rounded-md">
          <h4 className="text-xl">{project?.name}</h4>
        </div>

        <div className="flex gap-2 items-center">
          {/* Edit with AI button */}
          <WithTooltip
            content={
              isSelectedVersion
                ? "You are editing this version"
                : "Select this version to edit with AI"
            }
          >
            <Button
              variant={isSelectedVersion ? "secondary" : "outline"}
              size="sm"
              onClick={handleSelectEditAI}
              disabled={isSelectedVersion}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              {isSelectedVersion ? "Editing" : "Edit with AI"}
            </Button>
          </WithTooltip>
          {/* Go to Latest Version button */}
          {handleGoToVersion && (
            <WithTooltip
              content={
                isSelectedVersion
                  ? "You are already on this version"
                  : "Go to selected version"
              }
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleGoToVersion("selected")}
                className="flex items-center"
                aria-label="Go to selected version"
                disabled={isSelectedVersion}
              >
                <CornerUpRight className="h-5 w-5" />
              </Button>
            </WithTooltip>
          )}
        </div>
        <div className="flex gap-0.5">
          {/* Go to Previous Version */}
          <WithTooltip content="Previous Version">
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              onClick={
                handleGoToVersion
                  ? () => handleGoToVersion("previous")
                  : undefined
              }
              disabled={isFirstVersion}
              aria-label="Go to previous version"
            >
              <ChevronLeft
                className={`h-5 w-5 ${getIconDisabledClass(isFirstVersion)}`}
              />
            </Button>
          </WithTooltip>
          {/* Go to Next Version */}
          <WithTooltip content="Next Version">
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              onClick={
                handleGoToVersion ? () => handleGoToVersion("next") : undefined
              }
              disabled={isLastVersion}
              aria-label="Go to next version"
            >
              <ChevronRight
                className={`h-5 w-5 ${getIconDisabledClass(isLastVersion)}`}
              />
            </Button>
          </WithTooltip>
          {/* Download */}
          <WithTooltip content="Download">
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              aria-label="Download"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
            </Button>
          </WithTooltip>
          {/* Print */}
          <WithTooltip content="Print">
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              onClick={onPrint}
              aria-label="Print"
            >
              <Printer className="h-5 w-5" />
            </Button>
          </WithTooltip>
          {/* Share */}
          <WithTooltip content="Share">
            <Condition>
              <Condition.If condition={!!artifacts[visibleVersionId!]}>
                <ArtifactSharePopover
                  artifactId={visibleVersionId!}
                  token={
                    artifacts[visibleVersionId!]?.metadata?.sharedToken
                      ?.token ?? null
                  }
                >
                  <Button
                    className="h-9 w-9 flex justify-center"
                    variant="ghost"
                    aria-label="Share"
                  >
                    <Share className="h-5 w-5" />
                  </Button>
                </ArtifactSharePopover>
              </Condition.If>
              <Condition.Else>
                <Button
                  className="h-9 w-9 flex justify-center"
                  variant="ghost"
                  aria-label="Share"
                  disabled
                >
                  <Share className="h-5 w-5" />
                </Button>
              </Condition.Else>
            </Condition>
          </WithTooltip>
        </div>
      </header>
      {!isSelectedVersion && (
        <AlertInfoStrip
          message={
            "To edit this version, click 'Edit with AI'. Otherwise, changes will apply to the currently selected version."
          }
        />
      )}
    </>
  );
};
