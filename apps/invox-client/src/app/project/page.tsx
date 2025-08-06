import React from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { ProjectGrid } from "~/components/project";
import Link from "next/link";

export default function AppPage() {
  return (
    <div className="pt-12 h-full flex flex-col mx-3">
      <div className="flex items-center justify-between my-8">
        <h2 className="text-xl md:text-3xl font-semibold">Projects</h2>
        <Button
          variant="outline"
          className="text-xs md:text-base flex items-center h-9"
          asChild
        >
          <Link href="project/create">
            <Plus className="h-5" />
            Add
          </Link>
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-auto" type="always">
        <ProjectGrid>
          {Array.from({ length: 20 }).map((_, i) => (
            <ProjectGrid.Item key={i}>
              <Image
                src={`https://placehold.co/600/png`}
                alt={`Project ${i + 1}`}
                fill
                className="rounded-sm"
              />
              <div className="absolute bottom-1 left-0 right-0 text-sm font-medium text-center px-2 py-4">
                <p>Zudio Invoice B/W {(i % 5) + 1}</p>
              </div>
            </ProjectGrid.Item>
          ))}
        </ProjectGrid>
      </ScrollArea>
    </div>
  );
}
