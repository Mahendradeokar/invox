"use client";

import React, { use } from "react";
import { ProjectGrid } from "~/components/project";
import { Button } from "~/components/ui/button";
import { ImageWithFallback } from "../shared";
import { GetProjectsResponse } from "@repo/shared-types";
import Link from "next/link";
import InfiniteScrollList from "../shared/infinite-scroll-list";
import { getProjectList } from "~/lib/requests/projects";
import { toast } from "sonner";

type ProjectListProps = {
  projectListPromise: Promise<GetProjectsResponse>;
};

const fetchMoreProjects = async (page: number, limit: number) => {
  const { data, error } = await getProjectList({ page, limit });
  if (error) {
    toast(error.detail);
    return { items: [], hasMore: false };
  }

  const items = data.projects;
  const { meta } = data;
  const hasMore = meta.totalPages > page;
  return { items, hasMore };
};

export const ProjectList: React.FC<ProjectListProps> = ({
  projectListPromise,
}) => {
  const { projects: projectList, meta } = use(projectListPromise);

  if (!projectList || projectList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-lg font-medium mb-2">No projects yet</div>
        <div className="text-sm text-muted-foreground mb-4">
          You have not created any project yet. Start by creating one using a
          template.
        </div>
        <Button asChild>
          <Link href="/project/create">Create Project</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <InfiniteScrollList
        initialData={projectList}
        fetchFn={fetchMoreProjects}
        limit={10}
        totalRecords={meta.totalPages}
        as={ProjectGrid}
        eagerLoad={false}
        renderItem={(project) => {
          return (
            <ProjectGrid.Item key={project._id.toString()} className="group">
              <Link href={`/app/${project._id}`}>
                <div className="relative w-full h-full p-3">
                  <ImageWithFallback
                    src={project.templatedMeta?.thumbnailUrl}
                    alt={project.name}
                    fill
                    className="rounded-sm object-fill"
                  />
                </div>
                <div className="mt-2 text-sm font-medium text-center truncate">
                  {project.name}
                </div>
              </Link>
            </ProjectGrid.Item>
          );
        }}
      />
    </>
  );
};
