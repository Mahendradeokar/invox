"use client";

import dynamic from "next/dynamic";
import { Loading } from "../shared";
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { cn } from "~/lib/utils";

const CustomTextarea = dynamic(
  () => import("~/components/app/custom-textarea"),
  {
    ssr: false,
    loading: () => (
      <Loading className="min-h-[48px] w-full rounded-lg -scale-50" />
    ),
  }
);

export const ChatTextarea = (props: ComponentProps<typeof CustomTextarea>) => {
  return (
    <>
      <CustomTextarea
        characterLimit={1000}
        {...props}
        className={cn("-mt-3 pt-3", props.className)}
      />
      <div className="flex justify-end">
        <Button className="h-8 w-8 -mr-1" variant="ghost">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};
