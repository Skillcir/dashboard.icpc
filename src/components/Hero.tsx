"use client";

import { useStats } from "@/lib/useStats";
import { useCountUp } from "@/lib/useCountUp";

function StatCard({
  label,
  value,
  breakdown,
  index,
}: {
  label: string;
  value: number;
  breakdown?: [string, number][];
  index: number;
}) {
  const displayValue = useCountUp(value);

  return (
    <div
      className="panel animate-rise rounded-lg border border-line bg-bg-panel p-5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="text-sm text-ink-dim">{label}</div>
      <div className="tabular mt-2 text-3xl font-semibold text-ink leading-none">
        {displayValue.toLocaleString("en-IN")}
      </div>
      {breakdown && breakdown.length > 0 && (
        <dl className="mt-3 space-y-1 border-t border-line-soft pt-3">
          {breakdown.map(([role, count]) => (
            <div key={role} className="flex items-center justify-between gap-3">
              <dt className="text-xs text-ink-dim truncate">
                {role}
                {count === 1 ? "" : "s"}
              </dt>
              <dd className="tabular text-xs text-ink-faint">
                {count.toLocaleString("en-IN")}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function Hero() {
  const {
    totalRegistrations,
    totalParticipants,
    roleCounts,
    totalStates,
    totalColleges,
    unmatched,
  } = useStats();
  const pendingReview = unmatched.length;

  return (
    <header className="border-b border-line bg-bg-panel/60">
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 animate-rise">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-brass-dim/50 bg-brass/10">
            <span className="font-display text-xs font-semibold text-brass">
              IC
            </span>
          </div>
          <span className="font-display text-sm font-semibold text-ink">
            Registration Board
          </span>
        </div>

        <div
          className="flex items-center gap-2 text-xs text-ink-dim animate-rise"
          style={{ animationDelay: "60ms" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-accepted" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accepted" />
          </span>
          Live
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-8 sm:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Registered teams" value={totalRegistrations} index={0} />
          <StatCard
            label="Total participants"
            value={totalParticipants}
            breakdown={roleCounts}
            index={1}
          />
          <StatCard label="States represented" value={totalStates} index={2} />
          <StatCard label="Colleges in directory" value={totalColleges} index={3} />
          <StatCard
            label="Colleges awaiting review"
            value={pendingReview}
            index={4}
          />
        </div>
      </div>
    </header>
  );
}
