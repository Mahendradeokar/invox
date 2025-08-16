"use client";

import dynamic from "next/dynamic";
import { Loading } from "../shared";
import { useState } from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { cn } from "~/lib/utils";
import { useGenerateMessage } from "~/hooks/use-generate-message";
import { useMessageStatus } from "~/store/message-store";

const CustomTextarea = dynamic(
  () => import("~/components/app/custom-textarea"),
  {
    ssr: false,
    loading: () => (
      <Loading className="min-h-[48px] w-full rounded-lg -scale-50" />
    ),
  }
);

export const ChatTextarea = () => {
  const { addMessage } = useGenerateMessage();
  const { isGenerating } = useMessageStatus();

  const [userPrompt, setUserPrompt] = useState<{
    reqId: string;
    prompt: string;
  }>(() => ({
    reqId: crypto.randomUUID(),
    prompt: "",
  }));

  const onSubmit = () => {
    if (isGenerating) return;
    setUserPrompt({
      reqId: crypto.randomUUID(),
      prompt: "",
    });
    addMessage({ role: "user", content: userPrompt.prompt });
  };

  return (
    <>
      <CustomTextarea
        characterLimit={1000}
        className={cn("-mt-3 pt-3")}
        isDisabled={isGenerating}
        key={userPrompt.reqId}
        onContentChange={(content) => {
          setUserPrompt((prev) => {
            return {
              ...prev,
              prompt: content,
            };
          });
        }}
        onGenerate={onSubmit}
      />
      <div className="flex justify-end">
        <Button
          className="h-8 w-8 -mr-1"
          disabled={isGenerating}
          variant="ghost"
          onClick={onSubmit}
        >
          <Send
            className={cn(
              "h-5 w-5",
              isGenerating ? "opacity-50 cursor-not-allowed" : ""
            )}
          />
        </Button>
      </div>
    </>
  );
};
