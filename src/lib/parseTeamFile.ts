import * as XLSX from "xlsx";
import type { Team, TeamMember, TeamStatus } from "./types";

const VALID_STATUS: TeamStatus[] = ["Accepted", "Pending", "Canceled"];

type Row = {
  id?: number | string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: number | string;
  teamId?: number | string;
  teamName?: string;
  teamStatus?: string;
  teamInstName?: string;
};

export class TeamFileParseError extends Error {}

export async function parseTeamFile(file: File): Promise<Team[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new TeamFileParseError("The file has no sheets.");
  }
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });

  const required = ["teamId", "teamName", "teamStatus", "teamInstName"];
  const firstRow = rows[0] ?? {};
  const missing = required.filter((col) => !(col in firstRow));
  if (rows.length === 0 || missing.length > 0) {
    throw new TeamFileParseError(
      `Expected columns: id, role, firstName, lastName, phone, teamId, teamName, teamStatus, teamInstName. Missing: ${
        missing.join(", ") || "no rows found"
      }.`,
    );
  }

  const teams = new Map<number, Team>();
  const order: number[] = [];
  let rowIndex = 0;

  for (const row of rows) {
    rowIndex += 1;
    const teamId = Number(row.teamId);
    if (!Number.isFinite(teamId)) continue;

    if (!teams.has(teamId)) {
      const rawStatus = String(row.teamStatus ?? "").trim();
      const status = VALID_STATUS.includes(rawStatus as TeamStatus)
        ? (rawStatus as TeamStatus)
        : "Pending";
      teams.set(teamId, {
        teamId,
        teamName: String(row.teamName ?? "").trim(),
        teamStatus: status,
        institution: String(row.teamInstName ?? "").trim(),
        members: [],
      });
      order.push(teamId);
    }

    const member: TeamMember = {
      id: Number(row.id) || rowIndex,
      role: String(row.role ?? "").trim(),
      firstName: String(row.firstName ?? "").trim(),
      lastName: String(row.lastName ?? "").trim(),
      phone: row.phone ? String(row.phone) : "",
    };
    teams.get(teamId)!.members.push(member);
  }

  return order.map((id) => teams.get(id)!);
}
