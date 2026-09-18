import type {
  College,
  CollegeStat,
  StateStat,
  Team,
  UnmatchedInstitution,
} from "./types";
import { canonicalStateName, normalizeInstitution } from "./normalize";

export function buildCollegeIndex(colleges: College[]): Map<string, College> {
  const index = new Map<string, College>();
  for (const college of colleges) {
    index.set(normalizeInstitution(college.name), college);
  }
  return index;
}

export function matchTeamCollege(
  team: Team,
  index: Map<string, College>,
): College | undefined {
  return index.get(normalizeInstitution(team.institution));
}

const STATUS_PRIORITY: Record<Team["teamStatus"], number> = {
  Accepted: 2,
  Pending: 1,
  Canceled: 0,
};

const REQUIRED_TEAM_SIZE = 3;

function contestantCount(team: Team): number {
  return team.members.filter((m) => m.role === "Contestant").length;
}

/** A registration is identified by team name (within one college), not by
 * row/teamId: the same team can appear more than once — a partial roster
 * that got canceled and then re-registered with the full lineup, for
 * instance — and all of those rows are the same team, not separate
 * registrations. Institution is part of the key too, since unrelated teams
 * at different colleges sometimes land on the same name by coincidence.
 *
 * Canceled rows are dropped up front — a canceled team isn't a
 * registration, even if it once had a full roster. Among a team's
 * remaining rows, the one with a complete 3-contestant roster and the
 * furthest-along status wins. A team never assembled to 3 contestants in
 * any of its remaining rows isn't a real registration yet, so it's
 * dropped too. */
export function dedupeTeamsByName(teams: Team[]): Team[] {
  const groups = new Map<string, Team[]>();
  for (const team of teams) {
    if (team.teamStatus === "Canceled") continue;
    if (!team.teamName.trim()) continue;
    const key = `${team.teamName.trim()}\u0000${team.institution.trim()}`;
    const group = groups.get(key);
    if (group) group.push(team);
    else groups.set(key, [team]);
  }

  const result: Team[] = [];
  for (const group of groups.values()) {
    const best = group.reduce((a, b) => {
      const aComplete = contestantCount(a) === REQUIRED_TEAM_SIZE;
      const bComplete = contestantCount(b) === REQUIRED_TEAM_SIZE;
      if (aComplete !== bComplete) return aComplete ? a : b;
      if (STATUS_PRIORITY[a.teamStatus] !== STATUS_PRIORITY[b.teamStatus]) {
        return STATUS_PRIORITY[a.teamStatus] > STATUS_PRIORITY[b.teamStatus] ? a : b;
      }
      return contestantCount(a) >= contestantCount(b) ? a : b;
    });
    if (contestantCount(best) === REQUIRED_TEAM_SIZE) {
      result.push(best);
    }
  }
  return result;
}

export function computeStateStats(
  allTeams: Team[],
  colleges: College[],
): StateStat[] {
  const teams = dedupeTeamsByName(allTeams);
  const index = buildCollegeIndex(colleges);
  const byState = new Map<string, StateStat>();
  const collegesByState = new Map<string, Set<number>>();

  for (const team of teams) {
    const college = matchTeamCollege(team, index);
    if (!college) continue;
    const state = canonicalStateName(college.state);

    if (!byState.has(state)) {
      byState.set(state, {
        state,
        registrations: 0,
        colleges: 0,
        accepted: 0,
        pending: 0,
        canceled: 0,
      });
      collegesByState.set(state, new Set());
    }
    const stat = byState.get(state)!;
    stat.registrations += 1;
    if (team.teamStatus === "Accepted") stat.accepted += 1;
    else if (team.teamStatus === "Pending") stat.pending += 1;
    else if (team.teamStatus === "Canceled") stat.canceled += 1;
    collegesByState.get(state)!.add(college.id);
  }

  for (const stat of byState.values()) {
    stat.colleges = collegesByState.get(stat.state)?.size ?? 0;
  }

  return [...byState.values()].sort((a, b) => b.registrations - a.registrations);
}

export function computeCollegeStats(
  allTeams: Team[],
  colleges: College[],
): CollegeStat[] {
  const teams = dedupeTeamsByName(allTeams);
  const index = buildCollegeIndex(colleges);
  const byCollege = new Map<number, CollegeStat>();

  for (const team of teams) {
    const college = matchTeamCollege(team, index);
    if (!college) continue;

    if (!byCollege.has(college.id)) {
      byCollege.set(college.id, {
        college,
        registrations: 0,
        accepted: 0,
        pending: 0,
        canceled: 0,
      });
    }
    const stat = byCollege.get(college.id)!;
    stat.registrations += 1;
    if (team.teamStatus === "Accepted") stat.accepted += 1;
    else if (team.teamStatus === "Pending") stat.pending += 1;
    else if (team.teamStatus === "Canceled") stat.canceled += 1;
  }

  return [...byCollege.values()].sort(
    (a, b) => b.registrations - a.registrations,
  );
}

export function computeUnmatchedInstitutions(
  allTeams: Team[],
  colleges: College[],
): UnmatchedInstitution[] {
  const teams = dedupeTeamsByName(allTeams);
  const index = buildCollegeIndex(colleges);
  const byInstitution = new Map<string, UnmatchedInstitution>();

  for (const team of teams) {
    if (matchTeamCollege(team, index)) continue;
    if (!team.institution) continue;

    if (!byInstitution.has(team.institution)) {
      byInstitution.set(team.institution, {
        institution: team.institution,
        teamCount: 0,
        sampleTeamNames: [],
      });
    }
    const entry = byInstitution.get(team.institution)!;
    entry.teamCount += 1;
    if (entry.sampleTeamNames.length < 3) {
      entry.sampleTeamNames.push(team.teamName);
    }
  }

  return [...byInstitution.values()].sort((a, b) => b.teamCount - a.teamCount);
}

export function teamsForState(
  allTeams: Team[],
  colleges: College[],
  state: string,
): { team: Team; college: College }[] {
  const teams = dedupeTeamsByName(allTeams);
  const index = buildCollegeIndex(colleges);
  const result: { team: Team; college: College }[] = [];
  for (const team of teams) {
    const college = matchTeamCollege(team, index);
    if (college && canonicalStateName(college.state) === state) {
      result.push({ team, college });
    }
  }
  return result;
}
