import React, { Suspense } from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectList } from "~/components/project";
import Link from "next/link";
import { Loading } from "~/components/shared";
import { getProjectList } from "~/lib/requests/projects";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Templates",
  description:
    "Manage your invoice template projects. Create, view, and customize your AI-powered invoice templates with Invox.",
  keywords: [
    "Invox",
    "Projects",
    "Invoice Templates",
    "Template Management",
    "AI Invoice",
    "Project List",
    "Customize Templates",
  ],
  openGraph: {
    title: "Projects | Templates",
    description:
      "Browse and manage your invoice template projects in Invox. Create new projects and customize your templates with AI assistance.",
    url: "https://invox-ai.vercel.app/project",
  },
};

export default async function AppPage() {
  const cookieStore = await cookies();
  const anonId = cookieStore.get("_anonId")?.value;

  const projectListPromise = getProjectList(
    { page: 1, limit: 10 },
    {
      headers: anonId ? { "x-anon-id": anonId } : {},
    }
  ).then((res) => {
    if (res.error) {
      throw res.error;
    }
    return res.data;
  });

  return (
    <div className="pt-12 h-full flex flex-col mx-3">
      <div className="flex items-center justify-between my-8">
        <h2 className="text-xl md:text-3xl font-semibold">Projects</h2>
        <Button
          variant="outline"
          className="text-xs md:text-base flex items-center h-9"
          asChild
        >
          <Link href="/project/create">
            <Plus className="h-5" />
            New
          </Link>
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-auto" type="always">
        <Suspense fallback={<Loading />}>
          <ProjectList projectListPromise={projectListPromise} />
        </Suspense>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
