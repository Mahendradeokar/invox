"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { GetAllTemplatesResponse } from "@repo/shared-types";
import { ImageWithFallback } from "../shared";
import { Button } from "../ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ScrollArea } from "../ui/scroll-area";
import { useIsMobile } from "~/hooks/use-mobile";
import { LoadingButton } from "../ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";

import { useForm } from "react-hook-form";
import z from "zod";
import { createProject } from "~/lib/requests/projects";

type TemplateView = {
  template: GetAllTemplatesResponse[number];
  children: React.ReactNode;
};

export const TemplateView: React.FC<TemplateView> = ({
  template,
  children,
}) => {
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {children}
        <div className="absolute bottom-4 right-0 left-0 text-center">
          <Button
            className="px-8 text-center bg-foreground/50"
            onClick={() => setDialogOpen(true)}
          >
            Use this
          </Button>
        </div>
        <CreateProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          template={{ id: template.id, name: template.name }}
        />
      </>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerTitle className="sr-only">{template.name}</DrawerTitle>
        <ScrollArea className="h-full py-3" type="always">
          <div className="flex flex-wrap gap-8 h-full justify-center">
            <div className="basis-md">
              <AspectRatio ratio={1 / 1.44}>
                <ImageWithFallback
                  src={template.thumbnailUrl || ""}
                  alt={template.name}
                  fill
                  className="rounded-lg"
                />
              </AspectRatio>
            </div>
            <div className="basis-md flex flex-col px-5">
              <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2">
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-bold">{template.name}</h2>
                  <p className="text-muted-foreground text-base">
                    {template.description}
                  </p>
                </div>
                <Button
                  className="w-full mt-8"
                  size="lg"
                  type="button"
                  onClick={() => setDialogOpen(true)}
                >
                  Use this template
                </Button>
                <CreateProjectDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  template={{ id: template.id, name: template.name }}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

import { useRouter } from "next/navigation";

const CreateProjectDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: { id: string; name: string };
}> = ({ open, onOpenChange, template }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const createProjectSchema = z.object({
    projectName: z.string().min(1, "Project name is required"),
  });

  type FormValues = z.infer<typeof createProjectSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
    },
  });

  const onSubmit = async (value: FormValues) => {
    setServerError(null);
    const { data, error } = await createProject({
      name: value.projectName,
      selectedTemplate: template.id,
    });

    if (error) {
      setServerError("Something went wrong! Please try again");
      return;
    }

    router.push(`/app/${data._id}`);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="project-name" className="block mb-1 font-medium">
              Project name
            </label>
            <Input
              id="project-name"
              {...register("projectName")}
              placeholder={`e.g. ${template.name} Project`}
              required
              autoFocus
              aria-invalid={!!errors.projectName}
              aria-describedby={
                errors.projectName ? "project-name-error" : undefined
              }
            />
            {errors.projectName && (
              <div className="text-destructive text-sm mt-1" role="alert">
                {errors.projectName.message}
              </div>
            )}
          </div>
          {serverError && (
            <div className="text-destructive text-sm">{serverError}</div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingLabel="Creating..."
              disabled={!isValid || isSubmitting}
            >
              Create Project
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
