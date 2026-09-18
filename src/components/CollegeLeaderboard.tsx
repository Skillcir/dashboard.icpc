"use client";

import { useState } from "react";
import { useStats } from "@/lib/useStats";
import { useDashboardStore } from "@/store/useDashboardStore";
import { INDIA_STATES } from "@/lib/normalize";

export function CollegeLeaderboard() {
  const { collegeStats } = useStats();
  const updateCollegeState = useDashboardStore((s) => s.updateCollegeState);
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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
        {visible.map((c, i) => {
          const isEditing = editingId === c.college.id;
          return (
            <li key={c.college.id} className="py-2.5">
              <div className="flex items-center gap-4">
                <span className="tabular w-6 text-ink-faint text-sm">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-ink text-sm truncate">
                    {c.college.name}
                  </p>
                  {isEditing ? (
                    <StateEditForm
                      collegeId={c.college.id}
                      currentState={c.college.state}
                      onSave={(state) => {
                        updateCollegeState(c.college.id, state);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <p className="text-xs text-ink-dim">
                      {c.college.city}, {c.college.state}
                    </p>
                  )}
                </div>
                <span className="tabular text-ink font-medium w-12 text-right">
                  {c.registrations}
                </span>
                {!isEditing && (
                  <button
                    onClick={() => setEditingId(c.college.id)}
                    className="shrink-0 text-xs text-brass hover:text-ink transition-colors"
                  >
                    Edit state
                  </button>
                )}
              </div>
            </li>
          );
        })}
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

function StateEditForm({
  collegeId,
  currentState,
  onSave,
  onCancel,
}: {
  collegeId: number;
  currentState: string;
  onSave: (state: string) => void;
  onCancel: () => void;
}) {
  const [state, setState] = useState(currentState);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!state) return;
        onSave(state);
      }}
      className="mt-1.5 flex items-center gap-2"
    >
      <select
        aria-label={`State for college ${collegeId}`}
        autoFocus
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="rounded border border-line bg-bg px-2 py-1 text-xs text-ink"
      >
        {INDIA_STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded border border-brass-dim bg-brass/10 px-2 py-1 text-xs text-brass hover:bg-brass/20 transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-ink-dim hover:text-ink"
      >
        Cancel
      </button>
    </form>
  );
}
