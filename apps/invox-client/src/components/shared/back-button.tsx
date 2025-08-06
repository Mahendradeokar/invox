"use client";

import { Button } from "../ui/button";

export const BackButton = (props: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      {...props}
      onClick={(e) => {
        window.history.back();
        props?.onClick?.(e);
      }}
    >
      {props.children}
    </Button>
  );
};
