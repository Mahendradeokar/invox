import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { MessageStoreMessage } from "~/types/message";
import { getMessageDisplayText } from "~/lib/message-utils";
import { MarkdownRenderer, Ternary } from "../shared";
import { useArtifacts } from "~/store/artifact-store";
import { ArtifactMessageBlock } from "./message-blocks";
import { CopyButton } from "../shared/copy-button";
import { Message } from "@repo/shared-types";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { cn } from "~/lib/utils";

export const UserMessage = ({
  message,
}: ComponentProps<"div"> & { message: MessageStoreMessage }) => {
  const content = getMessageDisplayText(message);
  const { copyState, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="flex flex-col pt-12 first:pt-3 self-end max-w-[var(--user-chat-width)] group">
      <div className="rounded-sm px-4 py-3 bg-secondary">{content}</div>
      <div
        className={cn(
          "flex justify-end py-1 group-hover:opacity-100 transition-opacity",
          copyState === "idle" ? "opacity-0" : "opacity-100"
        )}
      >
        <CopyButton
          variant="ghost"
          copyToClipboard={() => copyToClipboard(content)}
          copyState={copyState}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

// Assistant
type AssistantMessageProps = ComponentProps<"div"> & {
  message: MessageStoreMessage;
};

const AssistantTextMessage = ({ message, ...rest }: AssistantMessageProps) => {
  const artifacts = useArtifacts();
  const artifactId = message.artifactId?.toString?.();

  const artifact =
    artifactId && artifacts[artifactId] ? artifacts[artifactId] : null;

  return (
    <div className="self-start last:pb-12 px-4" {...rest}>
      <MarkdownRenderer content={getMessageDisplayText(message)} />
      <Ternary
        condition={Boolean(message?.meta?.isArtifactUpdated) && !!artifactId}
      >
        <ArtifactMessageBlock artifactId={artifactId!} artifact={artifact} />
      </Ternary>
    </div>
  );
};

const AssistantErrorMessage = ({ message, ...rest }: AssistantMessageProps) => {
  return (
    <div
      className="self-start last:pb-12 px-4 text-red-600 bg-red-50 border border-red-200 rounded-sm p-2 flex items-center gap-2 animate-shake"
      {...rest}
    >
      <span>
        <strong>Oops!</strong>{" "}
        {getMessageDisplayText(message) || "An error occurred."}
      </span>
    </div>
  );
};

const AssistantPlaceholderMessage = ({
  message,
  ...rest
}: AssistantMessageProps) => (
  <div
    className="self-start last:pb-12 px-4 text-muted-foreground italic opacity-80"
    {...rest}
  >
    <span className="inline-flex items-center gap-2">
      <span className="animate-pulse text-base font-semibold text-muted-foreground/80">
        {getMessageDisplayText(message) ?? "Thinking..."}
      </span>
    </span>
  </div>
);

export const AssistantMessage = ({
  message,
  ...rest
}: AssistantMessageProps) => {
  if (message.uiType === "error") {
    return <AssistantErrorMessage message={message} {...rest} />;
  }
  if (message.uiType === "placeholder") {
    return <AssistantPlaceholderMessage message={message} {...rest} />;
  }
  // Default to text
  return <AssistantTextMessage message={message} {...rest} />;
};
