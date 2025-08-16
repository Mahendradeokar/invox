import { Project } from "@repo/shared-types";
import { create } from "zustand";

interface ProjectStoreState {
  project: Project | null;
  actions: {
    setProject: (project: Project) => void;
    clear: () => void;
  };
}

const useProjectStore = create<ProjectStoreState>((set) => ({
  project: null,
  actions: {
    setProject: (project: Project) => set({ project }),
    clear: () => set({ project: null }),
  },
}));

export const useProject = () => useProjectStore((state) => state.project);

export const useProjectActions = () =>
  useProjectStore((state) => state.actions);
