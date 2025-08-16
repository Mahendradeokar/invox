"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Artifact,
  AssistantMessage,
  ChatHeader,
  ChatTextarea,
  UserMessage,
} from "~/components/app";
import { Loading } from "~/components/shared";
import { AutoScroll } from "~/components/shared/auto-scroll";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getProjectInitialData } from "~/lib/requests/projects";
import { useArtifactActions } from "~/store/artifact-store";
import { useMessageActions, useMessages } from "~/store/message-store";
import { useProjectActions } from "~/store/project-store";

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const { setArtifacts, setVersionList, setSelectedArtifactId } =
    useArtifactActions();

  const { setProject } = useProjectActions();

  const messages = useMessages();
  const { setMessages } = useMessageActions();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      const { data, error } = await getProjectInitialData(projectId);

      if (error && error.code === "not_found") {
        router.replace("/project");
        return;
      }

      if (error) {
        toast(error.detail);
        return;
      }

      if (data.messages) {
        setMessages(data.messages);

        const artifactIds = Array.from(
          new Set(
            data.messages
              .filter((item) => item.role === "assistant")
              .map((msg) => msg.artifactId?.toString())
              .filter((id): id is string => Boolean(id))
          )
        );

        if (artifactIds.length > 0) {
          setVersionList(artifactIds);
          setSelectedArtifactId(artifactIds[artifactIds.length - 1]);
        }
      }

      if (data.project) {
        setProject(data.project);
      }

      setLoading(false);
    }

    if (projectId) {
      fetchInitialData();
    }
  }, [
    projectId,
    setArtifacts,
    setMessages,
    setProject,
    setSelectedArtifactId,
    setVersionList,
    router,
  ]);

  if (loading) {
    return <Loading />;
  }

  console.dir(messages, { depth: null });

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 max-w-md px-4 border-r">
        <ChatHeader />
        <ScrollArea className="-mx-4 px-4 min-h-0 grow-1">
          <div className="flex flex-col rounded-xs py-4">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <UserMessage
                  key={msg._id?.toString() ?? msg.tempId}
                  message={msg}
                />
              ) : (
                <AssistantMessage
                  key={msg._id?.toString() ?? msg.tempId}
                  message={msg}
                />
              )
            )}
            <AutoScroll
              deps={[
                messages[messages.length - 1]._id?.toString() ??
                  messages.length,
              ]}
            />
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
        <Artifact />
      </div>
    </div>
  );
}
