import { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export const ProjectGrid = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 min-[31rem]:grid-cols-2 justify-items-center md:grid-cols-3 justify-center gap-3 px-4 pb-8",
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

const ProjectGridItem = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn("relative w-60 aspect-[210/297]", className)}
      {...restProps}
    >
      {children}{" "}
    </div>
  );
};

ProjectGrid.Item = ProjectGridItem;
