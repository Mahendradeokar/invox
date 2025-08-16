import { create } from "zustand";
import { v6 as uuidV6 } from "uuid";
import { MessageStoreMessage } from "~/types/message";
import { SetOptional } from "@repo/shared-types";

interface MessageStoreState {
  messages: MessageStoreMessage[];
  status: {
    isGenerating: boolean;
  };
  actions: {
    setMessages: (
      messages: SetOptional<MessageStoreMessage, "tempId">[]
    ) => void;
    addMessage: (message: SetOptional<MessageStoreMessage, "tempId">) => void;
    clear: () => void;
    setStatus: (status: { isGenerating: boolean }) => void;
  };
}

const useMessageStore = create<MessageStoreState>((set) => ({
  messages: [],
  status: {
    isGenerating: false,
  },
  actions: {
    setMessages: (messages) =>
      set({
        messages: messages.map((item) => ({
          ...item,
          tempId: item._id!.toString(),
        })),
      }),
    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages.filter((msg) => msg.uiType !== "placeholder"),
          {
            ...message,
            tempId: message._id?.toString() ?? uuidV6(),
          },
        ],
      })),
    clear: () => set({ messages: [] }),
    setStatus: (status: { isGenerating: boolean }) => set({ status }),
  },
}));

export const useMessages = () => useMessageStore((state) => state.messages);
export const useMessageActions = () =>
  useMessageStore((state) => state.actions);
export const useMessageStatus = () => useMessageStore((state) => state.status);
