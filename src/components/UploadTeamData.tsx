"use client";

import { useRef, useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { parseTeamFile, TeamFileParseError } from "@/lib/parseTeamFile";

type Feedback =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; fileName: string; teamCount: number }
  | { kind: "error"; message: string };

export function UploadTeamData() {
  const replaceTeams = useDashboardStore((s) => s.replaceTeams);
  const uploadedFileName = useDashboardStore((s) => s.uploadedFileName);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setFeedback({ kind: "loading" });
    try {
      const teams = await parseTeamFile(file);
      if (teams.length === 0) {
        setFeedback({
          kind: "error",
          message: "No valid teams found in that file.",
        });
        return;
      }
      replaceTeams(teams, file.name);
      setFeedback({ kind: "success", fileName: file.name, teamCount: teams.length });
    } catch (err) {
      const message =
        err instanceof TeamFileParseError
          ? err.message
          : "Couldn't read that file. Make sure it's a .xlsx export.";
      setFeedback({ kind: "error", message });
    }
  }

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">
        Update team data
      </h3>
      <p className="text-sm text-ink-dim mt-1 max-w-md">
        Upload a new team-data export (.xlsx) to replace the current
        registrations. Every chart on this board updates immediately.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded border border-brass-dim bg-brass/10 px-4 py-2 text-sm text-brass hover:bg-brass/20 transition-colors"
        >
          Upload team data
        </button>
        {uploadedFileName && (
          <span className="text-xs text-ink-dim truncate max-w-[16rem]">
            Current file: {uploadedFileName}
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void handleFile(file);
          }}
        />
      </div>

      <div className="mt-3 min-h-5 text-sm">
        {feedback.kind === "loading" && (
          <p className="text-ink-dim">Reading file…</p>
        )}
        {feedback.kind === "success" && (
          <p className="text-accepted">
            Loaded {feedback.teamCount.toLocaleString("en-IN")} teams from{" "}
            {feedback.fileName}.
          </p>
        )}
        {feedback.kind === "error" && (
          <p className="text-canceled">{feedback.message}</p>
        )}
      </div>
    </div>
  );
}
