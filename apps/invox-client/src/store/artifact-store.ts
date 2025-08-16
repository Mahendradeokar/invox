import { Artifact } from "@repo/shared-types";
import { create } from "zustand";

type ArtifactMap = Record<string, Artifact>;

interface ArtifactStoreState {
  artifacts: ArtifactMap; // All versions, keyed by artifact _id
  versionList: string[]; // Ordered list of artifact _ids (versions)
  selectedArtifactId: string | null;
  currantVisibleVersion: string | null;
  actions: {
    setArtifacts: (artifacts: Artifact[]) => void;
    addArtifact: (artifact: Artifact) => void;
    setVersionList: (versionIds: string[]) => void;
    addVersion: (artifactId: string) => void;
    clear: () => void;
    setSelectedArtifactId: (artifactId: string | null) => void;
    setCurrantVisibleVersion: (versionId: string | null) => void;
  };
}

const defaultValues = {
  artifacts: {},
  versionList: [],
  selectedArtifactId: null,
  currantVisibleVersion: null,
};

export const useArtifactStore = create<ArtifactStoreState>((set) => ({
  ...defaultValues,
  actions: {
    setArtifacts: (artifacts: Artifact[]) =>
      set(() => {
        const artifactMap: ArtifactMap = {};
        const versionIds: string[] = [];
        for (const artifact of artifacts) {
          if (artifact._id) {
            const id = artifact._id.toString();
            artifactMap[id] = artifact;
            versionIds.push(id);
          }
        }
        return {
          artifacts: artifactMap,
          versionList: versionIds,
        };
      }),
    addArtifact: (artifact: Artifact) =>
      set((state) => {
        if (!artifact._id) return {};
        const id = artifact._id.toString();
        // Only add to versionList if not already present
        const alreadyExists = state.versionList.includes(id);
        return {
          artifacts: {
            ...state.artifacts,
            [id]: artifact,
          },
          versionList: alreadyExists
            ? state.versionList
            : [...state.versionList, id],
        };
      }),
    setVersionList: (versionIds: string[]) =>
      set(() => ({
        versionList: versionIds,
      })),
    addVersion: (artifactId: string) =>
      set((state) => {
        if (state.versionList.includes(artifactId)) return {};
        return {
          versionList: [...state.versionList, artifactId],
        };
      }),
    setSelectedArtifactId: (artifactId: string | null) =>
      set({
        selectedArtifactId: artifactId,
        currantVisibleVersion: artifactId, // If selectedArtifactId change then currantVisibleVersion must change
      }),
    setCurrantVisibleVersion: (versionId: string | null) =>
      set({ currantVisibleVersion: versionId }),
    clear: () => set({ ...defaultValues }),
  },
}));

export const useArtifacts = () => useArtifactStore((state) => state.artifacts);
export const useSelectedArtifactId = () =>
  useArtifactStore((state) => state.selectedArtifactId);

export const useCurrantVisibleVersion = () =>
  useArtifactStore((state) => state.currantVisibleVersion);

export const useVersionList = () =>
  useArtifactStore((state) => state.versionList);

export const useArtifactActions = () =>
  useArtifactStore((state) => state.actions);
