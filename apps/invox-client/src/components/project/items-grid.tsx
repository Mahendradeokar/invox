import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";

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
    <AspectRatio ratio={1 / 1.38} className={cn(className)} {...restProps}>
      {children}
    </AspectRatio>
  );
};

ProjectGrid.Item = ProjectGridItem;
