"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { teamsForState } from "@/lib/data";
import { StatusPill } from "./StatusPill";

export function StateDetailDrawer({
  state,
  onClose,
}: {
  state: string;
  onClose: () => void;
}) {
  const colleges = useDashboardStore((s) => s.colleges);
  const teams = useDashboardStore((s) => s.teams);

  const entries = useMemo(
    () => teamsForState(teams, colleges, state),
    [teams, colleges, state],
  );

  const byCollege = useMemo(() => {
    const map = new Map<string, number>();
    for (const { college } of entries) {
      map.set(college.name, (map.get(college.name) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative w-full max-w-lg h-full overflow-y-auto bg-bg-panel border-l border-line p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-brass">State detail</p>
            <h2 className="font-display text-3xl font-semibold text-ink mt-1">
              {state}
            </h2>
            <p className="tabular text-ink-dim mt-1">
              {entries.length.toLocaleString("en-IN")} registered teams across{" "}
              {byCollege.length} college{byCollege.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded border border-line px-3 py-1.5 text-sm text-ink-dim hover:text-ink hover:border-ink-faint"
          >
            Close
          </button>
        </div>

        <section className="mt-8">
          <h3 className="text-sm text-ink-dim mb-3">Colleges in {state}</h3>
          <ul className="space-y-1.5">
            {byCollege.map(([name, count]) => (
              <li
                key={name}
                className="flex items-center justify-between gap-4 text-sm border-b border-line-soft pb-1.5"
              >
                <span className="text-ink">{name}</span>
                <span className="tabular text-ink-dim shrink-0">{count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="text-sm text-ink-dim mb-3">Registered teams</h3>
          <ul className="space-y-3">
            {entries.map(({ team, college }, i) => (
              <li
                key={`${team.teamId}-${team.teamName}-${i}`}
                className="rounded border border-line bg-bg-panel-2 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-ink">{team.teamName}</span>
                  <StatusPill status={team.teamStatus} />
                </div>
                <p className="text-xs text-ink-dim mt-0.5">{college.name}</p>
                <ul className="mt-2.5 space-y-1">
                  {team.members.map((m, i) => (
                    <li
                      key={`${team.teamId}-${m.id || i}-${i}`}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="text-ink">
                        {m.firstName} {m.lastName}
                      </span>
                      {m.role !== "Contestant" && (
                        <span className="text-xs text-ink-faint shrink-0">
                          {m.role}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
