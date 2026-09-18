"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import collegesSeed from "@/data/colleges.json";
import teamsSeed from "@/data/teams.json";
import type { College, Team } from "@/lib/types";

type DashboardState = {
  colleges: College[];
  teams: Team[];
  addedCollegeIds: Set<number>;
  uploadedFileName: string | null;
  addCollege: (college: Omit<College, "id">) => void;
  updateCollegeState: (collegeId: number, state: string) => void;
  replaceTeams: (teams: Team[], fileName: string) => void;
  resetToSeed: () => void;
};

let nextCollegeId = 100000;

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      colleges: collegesSeed as College[],
      teams: teamsSeed as Team[],
      addedCollegeIds: new Set<number>(),
      uploadedFileName: null,

      addCollege: (college) => {
        const id = nextCollegeId++;
        set((state) => ({
          colleges: [...state.colleges, { ...college, id }],
          addedCollegeIds: new Set(state.addedCollegeIds).add(id),
        }));
      },

      updateCollegeState: (collegeId, state) => {
        set((s) => ({
          colleges: s.colleges.map((c) =>
            c.id === collegeId ? { ...c, state } : c,
          ),
        }));
      },

      replaceTeams: (teams, fileName) => {
        set({ teams, uploadedFileName: fileName });
      },

      resetToSeed: () => {
        set({
          colleges: collegesSeed as College[],
          teams: teamsSeed as Team[],
          addedCollegeIds: new Set<number>(),
          uploadedFileName: null,
        });
      },
    }),
    {
      name: "icpc-dashboard-storage",
      partialize: (state) => ({
        colleges: state.colleges,
        teams: state.teams,
        uploadedFileName: state.uploadedFileName,
      }),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<DashboardState>) };
        const seedIds = new Set((collegesSeed as College[]).map((c) => c.id));
        merged.addedCollegeIds = new Set(
          merged.colleges.filter((c) => !seedIds.has(c.id)).map((c) => c.id),
        );
        const maxId = merged.colleges.reduce((m, c) => Math.max(m, c.id), 99999);
        nextCollegeId = Math.max(nextCollegeId, maxId + 1);
        return merged;
      },
    },
  ),
);
