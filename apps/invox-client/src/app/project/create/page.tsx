import React from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { ProjectGrid } from "~/components/project";

export default function CreateProject() {
  return (
    <div className="pt-12 h-full flex flex-col mx-3">
      <div className="flex items-center justify-between my-8">
        <h2 className="text-xl md:text-2xl font-semibold">Templates</h2>
      </div>
      <ScrollArea className="flex-1 overflow-auto" type="always">
        <ProjectGrid>
          {Array.from({ length: 20 }).map((_, i) => (
            <ProjectGrid.Item key={i} className="group">
              <Image
                src={`https://placehold.co/600/png`}
                alt={`Project ${i + 1}`}
                fill
                className="rounded-sm"
              />
              <div className="absolute bottom-1 hidden group-hover:block text-center left-0 right-0 text-sm font-medium px-2 py-4">
                <Button variant="secondary" className="px-5 py-2">
                  Use this
                </Button>
              </div>
            </ProjectGrid.Item>
          ))}
        </ProjectGrid>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
