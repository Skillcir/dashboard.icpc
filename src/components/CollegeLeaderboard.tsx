"use client";

import { useState } from "react";
import { useStats } from "@/lib/useStats";

export function CollegeLeaderboard() {
  const { collegeStats } = useStats();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? collegeStats : collegeStats.slice(0, 10);

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">
        College leaderboard
      </h3>
      <p className="text-sm text-ink-dim mt-1">
        Ranked by registered teams, across all states.
      </p>

      <ol className="mt-5 divide-y divide-line-soft">
        {visible.map((c, i) => (
          <li
            key={c.college.id}
            className="flex items-center gap-4 py-2.5"
          >
            <span className="tabular w-6 text-ink-faint text-sm">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-ink text-sm truncate">{c.college.name}</p>
              <p className="text-xs text-ink-dim">
                {c.college.city}, {c.college.state}
              </p>
            </div>
            <span className="tabular text-ink font-medium w-12 text-right">
              {c.registrations}
            </span>
          </li>
        ))}
      </ol>

      {collegeStats.length > 10 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 text-sm text-brass hover:text-ink"
        >
          {showAll ? "Show top 10" : `Show all ${collegeStats.length}`}
        </button>
      )}
    </div>
  );
}
