import { useRef } from "react";
import {
  useArtifactActions,
  useSelectedArtifactId,
} from "../store/artifact-store";
import { useProject } from "../store/project-store";
import { useMessageActions } from "../store/message-store";
import { createMessage } from "~/lib/requests/message";

type AddMessageInput = {
  content: string;
  role?: "user";
};

const PLACEHOLDER_CONFIG: { label: string; time: number }[] = [
  { label: "Working...", time: 10000 }, // 10 sec
  { label: "Analyzing your request...", time: 15000 }, // 15 sec
  { label: "Thinking...", time: 15000 }, // 15 sec
  { label: "Generating response...", time: 20000 }, // 20 sec
  { label: "Almost there...", time: 10000 }, // 10 sec
  { label: "Refining output...", time: 20000 }, // 20 sec
  { label: "Still working...", time: 15000 }, // 15 sec
  { label: "Hang tight...", time: 10000 }, // 10 sec
  { label: "Just a moment...", time: 30000 }, // 30 sec
];

function getPlaceholderContent(index: number) {
  const config =
    PLACEHOLDER_CONFIG[index] ||
    PLACEHOLDER_CONFIG[PLACEHOLDER_CONFIG.length - 1];
  return [config.label];
}

export function useGenerateMessage() {
  const selectedArtifactId = useSelectedArtifactId();
  const { addVersion, setSelectedArtifactId } = useArtifactActions();
  const project = useProject();
  const messagesActions = useMessageActions();

  const placeholderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearPlaceholderAndAbort = () => {
    if (placeholderTimeoutRef.current) {
      clearTimeout(placeholderTimeoutRef.current);
      placeholderTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const showPlaceholdersSequentially = (onCancel: () => void) => {
    let index = 0;

    const showNext = () => {
      messagesActions.addMessage({
        role: "assistant",
        uiType: "placeholder",
        content: { contentType: "text", parts: getPlaceholderContent(index) },
      });

      if (index < PLACEHOLDER_CONFIG.length - 1) {
        placeholderTimeoutRef.current = setTimeout(() => {
          index += 1;
          showNext();
        }, PLACEHOLDER_CONFIG[index].time);
      } else {
        placeholderTimeoutRef.current = setTimeout(() => {
          onCancel();
        }, PLACEHOLDER_CONFIG[index].time);
      }
    };

    showNext();
  };

  const generateResponse = async (userMessage: AddMessageInput) => {
    if (!selectedArtifactId || !project) return;

    messagesActions.setStatus({ isGenerating: true });

    showPlaceholdersSequentially(() => {
      clearPlaceholderAndAbort();
      messagesActions.setStatus({ isGenerating: false });
    });

    // Prepare API call
    abortControllerRef.current = new AbortController();
    try {
      const { data, error } = await createMessage({
        content: { contentType: "text", parts: [userMessage.content] },
        artifactId: selectedArtifactId,
        projectId: project._id?.toString(),
        role: "user",
      });

      if (error) {
        messagesActions.addMessage({
          uiType: "error",
          role: "assistant",
          meta: { error },
          content: {
            contentType: "text",
            parts: [error.detail ?? "Something went wrong!"],
          },
        });
        messagesActions.setStatus({ isGenerating: false });
        clearPlaceholderAndAbort();
        return;
      }

      messagesActions.addMessage({
        ...data,
        _id: data._id?.toString?.() ?? data._id,
      });

      if (data.artifactId) {
        addVersion(data.artifactId.toString());
        setSelectedArtifactId(data.artifactId.toString());
      }

      messagesActions.setStatus({ isGenerating: false });
      clearPlaceholderAndAbort();
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name?: string }).name !== "AbortError"
      ) {
        messagesActions.setStatus({ isGenerating: false });
        clearPlaceholderAndAbort();
        // Optionally, add error message to messages
      }
    }
  };

  const addMessage = (input: AddMessageInput) => {
    const userMsg = {
      role: "user",
      content: { contentType: "text", parts: [input.content] as string[] },
      uiType: "text",
    } as const;

    messagesActions.addMessage(userMsg);
    generateResponse(input);
  };

  return {
    addMessage,
  };
}
