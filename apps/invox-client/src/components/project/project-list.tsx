"use client";

import React, { use } from "react";
import { ProjectGrid } from "~/components/project";
import { Button } from "~/components/ui/button";
import { ImageWithFallback } from "../shared";
import { GetProjectsResponse } from "@repo/shared-types";
import Link from "next/link";
import InfiniteScrollList from "../shared/infinite-scroll-list";
import { getProjectList } from "~/lib/requests/projects";

type ProjectListProps = {
  projectListPromise: Promise<GetProjectsResponse>;
};

const fetchMoreProjects = async (page: number, limit: number) => {
  const { data, error } = await getProjectList({ page, limit });
  if (error) {
    throw error;
  }

  const items = data.projects;
  const { meta } = data;
  const hasMore = meta.totalPages > page;
  return { items, hasMore };
};

export const ProjectList: React.FC<ProjectListProps> = ({
  projectListPromise,
}) => {
  const { projects: projectList } = use(projectListPromise);

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
        as={ProjectGrid}
        eagerLoad={false}
        renderItem={(project) => {
          return (
            <ProjectGrid.Item key={project._id.toString()} className="group">
              <ImageWithFallback
                src="https://placehold.co/300x200/png"
                alt={project.name}
                fill
                className="rounded-sm"
              />
              <div className="absolute bottom-1 hidden group-hover:block text-center left-0 right-0 text-sm font-medium px-2 py-4">
                <Button asChild variant="secondary" className="px-5 py-2">
                  <Link href={`/app/${project._id}`}>Open</Link>
                </Button>
              </div>
            </ProjectGrid.Item>
          );
        }}
      />
    </>
  );
};
