import { ComponentProps } from "react";

export const Empty = ({ children }: ComponentProps<"div">) => (
  <div className="flex flex-1 items-center justify-center h-full w-full text-center">
    <span className="text-muted-foreground text-lg">{children}</span>
  </div>
);
