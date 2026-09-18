"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useStats } from "@/lib/useStats";
import { INDIA_STATES } from "@/lib/normalize";

export function UnmatchedColleges() {
  const { unmatched } = useStats();
  const addCollege = useDashboardStore((s) => s.addCollege);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  if (unmatched.length === 0) {
    return (
      <div>
        <h3 className="font-display text-xl font-semibold text-ink">
          Colleges awaiting review
        </h3>
        <p className="text-sm text-ink-dim mt-2">
          Every institution in the team data matches a college in the
          directory. Nothing to review.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">
        Colleges awaiting review
      </h3>
      <p className="text-sm text-ink-dim mt-1 max-w-md">
        {unmatched.length} institution{unmatched.length === 1 ? "" : "s"} in
        the team data don&apos;t match the college directory, so their teams
        aren&apos;t counted toward any state yet. Add them below.
      </p>

      <ul className="mt-5 divide-y divide-line-soft">
        {unmatched.map((entry) => {
          const isOpen = openFor === entry.institution;
          const added = justAdded.has(entry.institution);
          return (
            <li key={entry.institution} className="py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">
                    {entry.institution}
                  </p>
                  <p className="tabular text-xs text-ink-dim">
                    {entry.teamCount} team{entry.teamCount === 1 ? "" : "s"}
                  </p>
                </div>
                {added ? (
                  <span className="shrink-0 text-xs text-accepted">
                    Added
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      setOpenFor(isOpen ? null : entry.institution)
                    }
                    className="shrink-0 text-xs text-brass hover:text-ink"
                  >
                    {isOpen ? "Cancel" : "Add to directory"}
                  </button>
                )}
              </div>

              {isOpen && !added && (
                <AddCollegeForm
                  institution={entry.institution}
                  onCancel={() => setOpenFor(null)}
                  onAdd={(state, city) => {
                    addCollege({ name: entry.institution, state, city });
                    setJustAdded((prev) => new Set(prev).add(entry.institution));
                    setOpenFor(null);
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AddCollegeForm({
  institution,
  onAdd,
  onCancel,
}: {
  institution: string;
  onAdd: (state: string, city: string) => void;
  onCancel: () => void;
}) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!state) return;
        onAdd(state, city.trim());
      }}
      className="mt-3 flex flex-wrap items-end gap-3 rounded border border-line bg-bg-panel-2 p-3"
    >
      <div className="flex-1 min-w-[10rem]">
        <label className="block text-xs text-ink-dim mb-1" htmlFor={`state-${institution}`}>
          State
        </label>
        <select
          id={`state-${institution}`}
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full rounded border border-line bg-bg px-2 py-1.5 text-sm text-ink"
        >
          <option value="" disabled>
            Select a state
          </option>
          {INDIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[10rem]">
        <label className="block text-xs text-ink-dim mb-1" htmlFor={`city-${institution}`}>
          City (optional)
        </label>
        <input
          id={`city-${institution}`}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Pune"
          className="w-full rounded border border-line bg-bg px-2 py-1.5 text-sm text-ink placeholder:text-ink-faint"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!state}
          className="rounded border border-brass-dim bg-brass/10 px-3 py-1.5 text-sm text-brass hover:bg-brass/20 disabled:opacity-40 disabled:hover:bg-brass/10 transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-line px-3 py-1.5 text-sm text-ink-dim hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
