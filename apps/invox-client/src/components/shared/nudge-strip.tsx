"use client";

import * as React from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { X } from "lucide-react";
import { Button } from "../ui/button";

type NudgeStripProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

export function NudgeStrip({
  title,
  description,
  className = "",
}: NudgeStripProps) {
  const [open, setOpen] = React.useState(true);
  const stripRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (open && stripRef.current) {
      const el = stripRef.current;
      const height = el.offsetHeight;
      document.documentElement.style.setProperty(
        "--nudge-strip-height",
        `${height}px`
      );
    } else {
      document.documentElement.style.removeProperty("--nudge-strip-height");
    }
  }, [open]);

  // Remove CSS variable on unmount
  React.useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--nudge-strip-height");
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("nudge-strip-closed", "true");
  };

  if (!open) return null;

  return (
    <div ref={stripRef} className={`relative w-full ${className}`}>
      <Alert className="rounded-none border-b flex items-center py-2 pl-5 pr-10">
        <div className="flex-1 min-w-0 flex gap-1 flex-wrap justify-center items-center">
          <AlertTitle className="inline-block">
            {title ?? "Nudge info"}
          </AlertTitle>
          {description && (
            <AlertDescription className="text-yellow-900 inline-block">
              {description}
            </AlertDescription>
          )}
        </div>
        <Button
          aria-label="Close nudge"
          type="button"
          tabIndex={0}
          variant={"ghost"}
          size={"icon"}
          onClick={handleClose}
        >
          <X className="w-4 h-4 text-yellow-900" aria-hidden="true" />
        </Button>
      </Alert>
    </div>
  );
}
