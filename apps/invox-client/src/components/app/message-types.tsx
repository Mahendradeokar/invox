import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

export const UserMessage = ({ children }: ComponentProps<"div">) => {
  return (
    <div className="flex flex-col pt-12 first:pt-3 self-end max-w-[var(--user-chat-width)] group">
      <div className="rounded-sm px-4 py-3 bg-secondary">{children}</div>
      <div className="flex justify-end py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" className="h-8 w-8 cursor-pointer">
          <Copy className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export const AssistantMessage = ({ children }: ComponentProps<"div">) => {
  return <div className="self-start last:pb-12 px-4">{children}</div>;
};
