import React from "react";
import {
  ArtifactHeader,
  ArtifactViewer,
  AssistantMessage,
  ChatHeader,
  ChatTextarea,
  UserMessage,
} from "~/components/app";
import { ScrollArea } from "~/components/ui/scroll-area";

// Extracted chat messages config
const chatMessages = [
  { type: "user", content: "Hello, Invox!" },
  {
    type: "assistant",
    content: "Hi there! 👋 How can I help you today?",
  },
  {
    type: "user",
    content: "Can you summarize the latest project updates?",
  },
  {
    type: "assistant",
    content:
      "Sure! The latest updates include improved UI, faster response times, and new collaboration features.",
  },
  {
    type: "user",
    content:
      "That sounds great. Can you tell me more about the collaboration features?",
  },
  {
    type: "assistant",
    content:
      "Absolutely! You can now invite team members, assign tasks, and leave comments directly on artifacts.",
  },
  {
    type: "user",
    content: "How do I invite a team member?",
  },
  {
    type: "assistant",
    content:
      'Just click the "Invite" button in the top right corner and enter their email address.',
  },
  {
    type: "user",
    content: "Is there a limit to the number of team members?",
  },
  {
    type: "assistant",
    content: "Currently, you can invite up to 10 team members per project.",
  },
  {
    type: "user",
    content: "What happens if I reach the limit?",
  },
  {
    type: "assistant",
    content:
      "You’ll need to remove an existing member or upgrade your plan to add more.",
  },
  {
    type: "user",
    content: "Can I assign multiple tasks to one person?",
  },
  {
    type: "assistant",
    content:
      "Yes, you can assign as many tasks as you like to each team member.",
  },
  {
    type: "user",
    content: "How do I leave a comment on an artifact?",
  },
  {
    type: "assistant",
    content:
      "Open the artifact, scroll to the comments section, and type your message.",
  },
  {
    type: "user",
    content: "Are comments visible to everyone?",
  },
  {
    type: "assistant",
    content:
      "Comments are visible to all team members with access to the artifact.",
  },
  {
    type: "user",
    content: "Can I edit or delete my comments?",
  },
  {
    type: "assistant",
    content: "Yes, you can edit or delete your own comments at any time.",
  },
  {
    type: "user",
    content: "Is there a notification system for new comments?",
  },
  {
    type: "assistant",
    content: "Yes, you’ll receive notifications for new comments and mentions.",
  },
  {
    type: "user",
    content: "How do I turn off notifications?",
  },
  {
    type: "assistant",
    content:
      "You can manage your notification preferences in your account settings.",
  },
  {
    type: "user",
    content: "Can I export project data?",
  },
  {
    type: "assistant",
    content: "Yes, you can export your project data as a CSV or PDF file.",
  },
  {
    type: "user",
    content: "Is there a mobile app available?",
  },
  {
    type: "assistant",
    content:
      "A mobile app is currently in development and will be released soon!",
  },
  {
    type: "user",
    content: "Thank you for your help!",
  },
  {
    type: "assistant",
    content: "You’re welcome! If you have any more questions, just ask.",
  },
];

export default function AppPage() {
  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 max-w-md px-4 border-r">
        <ChatHeader />
        <ScrollArea className="-mx-4 px-8 flex-1 overflow-auto">
          <div className="flex flex-col rounded-xs py-4">
            {chatMessages.map((msg, idx) =>
              msg.type === "user" ? (
                <UserMessage key={idx}>{msg.content}</UserMessage>
              ) : (
                <AssistantMessage key={idx}>{msg.content}</AssistantMessage>
              )
            )}
          </div>
        </ScrollArea>
        <div className="relative border-2 rounded-sm px-3 pt-3">
          <ChatTextarea />
        </div>
        <div className="text-xs py-4">
          <div className="max-w-sm text-muted-foreground text-center m-auto ">
            Invox can make mistakes. Check important info. Results may vary.
          </div>
        </div>
      </div>
      <div className="flex-2 flex flex-col">
        <ArtifactHeader />
        <ArtifactViewer className="flex-1" />
      </div>
    </div>
  );
}
