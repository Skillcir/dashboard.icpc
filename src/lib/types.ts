export type College = {
  id: number;
  name: string;
  city: string;
  state: string;
};

export type TeamStatus = "Accepted" | "Pending" | "Canceled";

export type TeamMember = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type Team = {
  teamId: number;
  teamName: string;
  teamStatus: TeamStatus;
  institution: string;
  members: TeamMember[];
};

export type UnmatchedInstitution = {
  institution: string;
  teamCount: number;
  sampleTeamNames: string[];
};

export type StateStat = {
  state: string;
  registrations: number;
  colleges: number;
  accepted: number;
  pending: number;
  canceled: number;
};

export type CollegeStat = {
  college: College;
  registrations: number;
  accepted: number;
  pending: number;
  canceled: number;
};
