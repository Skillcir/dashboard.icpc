"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { IndiaMap } from "./IndiaMap";
import { StateDetailDrawer } from "./StateDetailDrawer";
import { StateLeaderboard } from "./StateLeaderboard";
import { CollegeLeaderboard } from "./CollegeLeaderboard";
import { UploadTeamData } from "./UploadTeamData";
import { UnmatchedColleges } from "./UnmatchedColleges";

export function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  return (
    <main className="flex-1">
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6">
          <div
            className="panel animate-rise rounded-lg border border-line bg-bg-panel p-6"
            style={{ animationDelay: "80ms" }}
          >
            <h2 className="font-display text-xl font-semibold text-ink">
              Registrations by state
            </h2>
            <p className="text-sm text-ink-dim mt-1">
              Click a shaded state to see its teams.
            </p>
            <div className="mt-6">
              <IndiaMap
                selectedState={selectedState}
                onSelectState={setSelectedState}
              />
            </div>
          </div>

          <div
            className="panel animate-rise rounded-lg border border-line bg-bg-panel p-6"
            style={{ animationDelay: "140ms" }}
          >
            <StateLeaderboard onSelectState={setSelectedState} />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
          <div className="panel animate-rise rounded-lg border border-line bg-bg-panel p-6">
            <CollegeLeaderboard />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 grid md:grid-cols-2 gap-6">
          <div className="panel animate-rise rounded-lg border border-line bg-bg-panel p-6">
            <UploadTeamData />
          </div>
          <div
            className="panel animate-rise rounded-lg border border-line bg-bg-panel p-6"
            style={{ animationDelay: "60ms" }}
          >
            <UnmatchedColleges />
          </div>
        </div>
      </section>

      {selectedState && (
        <StateDetailDrawer
          state={selectedState}
          onClose={() => setSelectedState(null)}
        />
      )}
    </main>
  );
}
