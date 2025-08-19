import React, { Suspense } from "react";
import { TemplateList } from "~/components/project";
import { Loading } from "~/components/shared";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { getTemplates } from "~/lib/requests/templates";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Info } from "lucide-react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select a Template | New Project",
  description:
    "Choose a template to get started with your new project. Browse available templates and select one to begin customizing your invoice project in Invox.",
};

export default async function CreateProject() {
  const cookieStore = await cookies();
  const anonId = cookieStore.get("_anonId")?.value;

  const templateListPromise = getTemplates({
    headers: anonId ? { "x-anon-id": anonId } : {},
  }).then((res) => {
    if (res.error) {
      throw res.error;
    }
    return res.data;
  });

  return (
    <div className="pt-12 h-full flex flex-col mx-3">
      <div className="flex items-center justify-between my-8">
        <h2 className="text-xl md:text-3xl font-semibold">Templates</h2>
      </div>
      <div className="mb-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Select a template to start your new project.
          </AlertDescription>
        </Alert>
      </div>
      <ScrollArea className="flex-1 overflow-auto" type="always">
        <Suspense fallback={<Loading />}>
          <TemplateList templateListPromise={templateListPromise} />
        </Suspense>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
