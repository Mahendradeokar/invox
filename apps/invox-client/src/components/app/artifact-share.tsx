"use client";

import { useState } from "react";
import { createArtifactShareLink } from "~/lib/requests/artifact";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { LoadingButton } from "../ui/loading-button";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { Condition, If, Else } from "../shared/condition";

type ArtifactSharePopoverProps = {
  artifactId: string | null;
  token: string | null;
  children: React.ReactNode;
};

export const ArtifactSharePopover = ({
  artifactId,
  token: initialToken,
  children,
}: ArtifactSharePopoverProps) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { copyState, copyToClipboard } = useCopyToClipboard();

  const baseUrl = window.location.origin;

  const shareLink = token ? `${baseUrl}/shared/${token}` : undefined;

  const handleCreateLink = async () => {
    if (!artifactId) return;
    setLoading(true);
    setError(null);
    const { data, error } = await createArtifactShareLink(artifactId);
    setLoading(false);
    if (error) {
      setError(error.detail);
      return;
    }
    setToken(data.token);
  };

  const handleCopy = async () => {
    if (shareLink) {
      await copyToClipboard(shareLink);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96" align="start" alignOffset={-350}>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm">Share Invoice Link</div>
          {error && (
            <div className="text-xs text-red-500 bg-red-50 px-2 py-1">
              {error}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Condition>
              <If condition={!!token}>
                <div
                  className={cn(
                    "flex-1 px-2 py-1 rounded bg-muted text-xs break-all border border-muted-foreground/10"
                  )}
                >
                  {baseUrl}/artifact/share/...
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={["copied", "copying"].includes(copyState)}
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copyState === "copied" ? "Copied!" : "Copy"}
                </Button>
              </If>
              <Else>
                <div
                  className={cn(
                    "flex-1 px-2 py-1 rounded bg-muted text-xs text-muted-foreground border border-muted-foreground/10"
                  )}
                >
                  {baseUrl}/artifact/share/...
                </div>
                <LoadingButton
                  size="sm"
                  variant="default"
                  onClick={handleCreateLink}
                  isLoading={loading}
                  disabled={loading}
                  loadingLabel="Creating..."
                  className="shrink-0"
                >
                  Create Link
                </LoadingButton>
              </Else>
            </Condition>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
