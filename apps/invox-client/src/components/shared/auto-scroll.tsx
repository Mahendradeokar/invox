import { ComponentProps, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

export function useAutoScroll(
  ref: React.RefObject<HTMLElement | null>,
  deps: unknown[] = [],
  autoScroll = true
) {
  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [autoScroll, ref, ...deps]);
}

type AutoScrollProps = {
  children?: React.ReactNode;
  autoScroll?: boolean;
  deps?: unknown[];
} & ComponentProps<"div">;

export function AutoScroll({
  children,
  autoScroll = true,
  deps = [],
  ...rest
}: AutoScrollProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  useAutoScroll(elRef, deps, autoScroll);

  return (
    <div ref={elRef} {...rest} className={cn("h-8", rest.className)}>
      {children}
    </div>
  );
}
