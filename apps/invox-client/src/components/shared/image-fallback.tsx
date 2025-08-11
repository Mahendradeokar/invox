"use client";

import Image, { ImageProps } from "next/image";
import React, { useState } from "react";
import { getImagePlaceholder } from "~/lib/image-placeholder";
import { cn } from "~/lib/utils";

type ImageWithFallbackProps = Omit<
  ImageProps,
  "src" | "alt" | "onLoad" | "onError"
> & {
  src: string;
  alt?: string;
  errorFallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (e: unknown) => void;
  className?: string;
};

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = "",
  errorFallback,
  onLoad,
  onError,
  className = "",
  ...imageProps
}) => {
  const [status, setStatus] = useState<"loaded" | "error">();

  if (status === "error") {
    return (
      <div className={cn("h-full", className)}>
        {errorFallback ?? (
          <div className="w-full h-full bg-red-50 text-muted-foreground text-sm flex items-center justify-center">
            Failed to load image
          </div>
        )}
      </div>
    );
  }

  // Pass all next/image props down
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onLoad={onLoad}
      onError={(e) => {
        setStatus("error");
        onError?.(e);
      }}
      placeholder={getImagePlaceholder()}
      {...imageProps}
    />
  );
};
