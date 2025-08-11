import React, { Suspense } from "react";
import { TemplateList } from "~/components/project";
import { Loading } from "~/components/shared";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { getTemplates } from "~/lib/requests/templates";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Info } from "lucide-react";

export default function CreateProject() {
  const templateListPromise = getTemplates().then((res) => {
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
