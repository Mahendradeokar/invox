import React from "react";
import { Undo, Redo, Download, Share, Sparkle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ArtifactHeaderProps {
  title?: string;
  version?: string | number;
  onUndo?: () => void;
  onRedo?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onSelectEditAI?: () => void;
}

export const ArtifactHeader: React.FC<ArtifactHeaderProps> = ({
  title = "Template Name",
  version = "v8",
  onUndo,
  onRedo,
  onDownload,
  onShare,
  onSelectEditAI,
}) => {
  return (
    <header
      role="artifact-view-header"
      className="h-13 flex px-4 items-center border-b shadow-xs inset-shadow-xs"
    >
      <div className="flex gap-1 items-baseline max-w-lg rounded-md">
        <h4 className="text-xl">
          {title} - {version}
        </h4>
      </div>
      <div className="ml-auto flex gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              onClick={onUndo}
            >
              <Undo className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              onClick={onRedo}
            >
              <Redo className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              onClick={onDownload}
            >
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-9 w-9 flex justify-center"
              variant="ghost"
              onClick={onShare}
            >
              <Share className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
        <Button variant="secondary" onClick={onSelectEditAI}>
          <Sparkle className="h-6 w-6" />
          Select & Edit with AI
        </Button>
        {/* <Button>Selected</Button> */}
      </div>
    </header>
  );
};
