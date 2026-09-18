"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  computeCollegeStats,
  computeStateStats,
  computeUnmatchedInstitutions,
  dedupeTeamsByName,
} from "./data";

export function useStats() {
  const colleges = useDashboardStore((s) => s.colleges);
  const teams = useDashboardStore((s) => s.teams);

  return useMemo(() => {
    const stateStats = computeStateStats(teams, colleges);
    const collegeStats = computeCollegeStats(teams, colleges);
    const unmatched = computeUnmatchedInstitutions(teams, colleges);
    const validTeams = dedupeTeamsByName(teams);
    const totalRegistrations = validTeams.length;
    const roleCounts = new Map<string, number>();
    for (const team of validTeams) {
      for (const member of team.members) {
        roleCounts.set(member.role, (roleCounts.get(member.role) ?? 0) + 1);
      }
    }
    const totalParticipants = validTeams.reduce(
      (sum, team) => sum + team.members.length,
      0,
    );
    const totalStates = stateStats.length;
    const matchedCollegeIds = new Set(collegeStats.map((c) => c.college.id));

    return {
      colleges,
      teams,
      stateStats,
      collegeStats,
      unmatched,
      totalRegistrations,
      totalParticipants,
      roleCounts: [...roleCounts.entries()].sort((a, b) => b[1] - a[1]),
      totalStates,
      totalColleges: colleges.length,
      collegesWithRegistrations: matchedCollegeIds.size,
    };
  }, [colleges, teams]);
}
