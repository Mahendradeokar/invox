import React, { use } from "react";
import { ProjectGrid } from "~/components/project";
import { GetAllTemplatesResponse } from "@repo/shared-types";
import { Empty, ImageWithFallback } from "../shared";
import { TemplateView } from "./template-view";

type TemplateListProps = {
  templateListPromise: Promise<GetAllTemplatesResponse>;
};

export const TemplateList: React.FC<TemplateListProps> = ({
  templateListPromise,
}) => {
  const templateList = use(templateListPromise);

  if (!templateList.length) {
    return <Empty>No templates found</Empty>;
  }

  return (
    <ProjectGrid>
      {templateList.map((template, i) => (
        <ProjectGrid.Item
          key={template.id}
          className="cursor-pointer transition-transform duration-200 scale-95 hover:scale-100"
        >
          <TemplateView template={template}>
            <ImageWithFallback
              src={template.thumbnailUrl}
              alt={template.name ? template.name : `Project ${i + 1}`}
              fill
              className="rounded-sm"
            />
          </TemplateView>
        </ProjectGrid.Item>
      ))}
    </ProjectGrid>
  );
};
