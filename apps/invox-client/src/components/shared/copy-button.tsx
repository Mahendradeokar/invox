"use client";

import { Copy, CopyCheck, XCircle } from "lucide-react";
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface CopyButtonProps extends ComponentProps<typeof Button> {
  copyState: "idle" | "copied" | "error" | "copying";
  copyToClipboard: () => void;
}

export function CopyButton({
  className,
  copyState,
  copyToClipboard,
  ...props
}: CopyButtonProps) {
  const hasCopied = copyState === "copied";
  const hasError = copyState === "error";

  let tooltipText = "Copy";
  if (hasCopied) tooltipText = "Copied!";
  if (hasError) tooltipText = "Copy failed";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className={className}
          onClick={() => copyToClipboard()}
          title={"Copy"}
          {...props}
        >
          {hasError ? (
            <XCircle className="text-destructive" />
          ) : hasCopied ? (
            <CopyCheck />
          ) : (
            <Copy />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
