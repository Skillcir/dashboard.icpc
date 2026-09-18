"use client";

import { useStats } from "@/lib/useStats";

export function StateLeaderboard({
  onSelectState,
}: {
  onSelectState: (state: string) => void;
}) {
  const { stateStats } = useStats();

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">
        State leaderboard
      </h3>
      <p className="text-sm text-ink-dim mt-1">Ranked by registered teams.</p>

      <ol className="mt-5 divide-y divide-line-soft">
        {stateStats.map((s, i) => (
          <li key={s.state}>
            <button
              onClick={() => onSelectState(s.state)}
              className="w-full flex items-center gap-4 py-2.5 text-left hover:bg-bg-panel-2 rounded px-2 -mx-2 transition-colors"
            >
              <span className="tabular w-6 text-ink-faint text-sm">
                {i + 1}
              </span>
              <span className="flex-1 text-ink text-sm">{s.state}</span>
              <span className="tabular text-xs text-ink-dim">
                {s.colleges} college{s.colleges === 1 ? "" : "s"}
              </span>
              <span className="tabular text-ink font-medium w-12 text-right">
                {s.registrations}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
