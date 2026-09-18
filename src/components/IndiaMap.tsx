"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { geoCentroid, geoMercator } from "d3-geo";
import { canonicalStateName } from "@/lib/normalize";
import { useStats } from "@/lib/useStats";

const TOPO_URL = "/india-states-topo.json";
const MAP_WIDTH = 520;
const MAP_HEIGHT = 560;

const projection = geoMercator()
  .center([82.8, 22.6])
  .scale(1050)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

type GeoProps = { NAME_1: string };
type GeoFeature = Parameters<typeof geoCentroid>[0];

export function IndiaMap({
  selectedState,
  onSelectState,
}: {
  selectedState: string | null;
  onSelectState: (state: string) => void;
}) {
  const { stateStats } = useStats();
  const [hovered, setHovered] = useState<{
    name: string;
    count: number;
    colleges: number;
    xPct: number;
    yPct: number;
  } | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const countByState = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of stateStats) map.set(s.state, s.registrations);
    return map;
  }, [stateStats]);

  const collegesByState = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of stateStats) map.set(s.state, s.colleges);
    return map;
  }, [stateStats]);

  const maxCount = useMemo(
    () => Math.max(1, ...stateStats.map((s) => s.registrations)),
    [stateStats],
  );

  function fillFor(count: number) {
    if (count === 0) return "#1a2124";
    const t = Math.sqrt(count / maxCount);
    const l = 22 + t * 30;
    return `hsl(38, 55%, ${l}%)`;
  }

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [82.8, 22.6], scale: 1050 }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Map of India shaded by team registration count per state"
      >
        <Geographies geography={TOPO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const props = geo.properties as GeoProps;
              const name = canonicalStateName(props.NAME_1);
              const count = countByState.get(name) ?? 0;
              const isSelected = selectedState === name;
              const isHovered = hoveredKey === geo.rsmKey;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const [x, y] = projection(
                      geoCentroid(geo as unknown as GeoFeature),
                    ) ?? [MAP_WIDTH / 2, MAP_HEIGHT / 2];
                    setHoveredKey(geo.rsmKey);
                    setHovered({
                      name,
                      count,
                      colleges: collegesByState.get(name) ?? 0,
                      xPct: (x / MAP_WIDTH) * 100,
                      yPct: (y / MAP_HEIGHT) * 100,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredKey(null);
                    setHovered(null);
                  }}
                  onClick={() => {
                    if (count > 0) onSelectState(name);
                  }}
                  fill={
                    isHovered
                      ? count > 0
                        ? "#e4b360"
                        : "#242c2f"
                      : fillFor(count)
                  }
                  stroke={isSelected || isHovered ? "#d3a24c" : "#0d1113"}
                  strokeWidth={isSelected || isHovered ? 1.4 : 0.6}
                  style={{
                    outline: "none",
                    cursor: count > 0 ? "pointer" : "default",
                    transition: "fill 120ms ease, stroke 120ms ease",
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {hovered && (
        <div
          className="pointer-events-none absolute z-50 rounded border border-line bg-bg-panel-2 px-3 py-2 text-sm shadow-lg animate-rise"
          style={{
            left: `${hovered.xPct}%`,
            top: `${hovered.yPct}%`,
            transform: "translate(16px, -50%)",
          }}
        >
          <div className="text-ink font-medium">{hovered.name}</div>
          <div className="tabular text-ink-dim">
            {hovered.count.toLocaleString("en-IN")} registration
            {hovered.count === 1 ? "" : "s"}
          </div>
          <div className="tabular text-ink-faint text-xs mt-0.5">
            {hovered.colleges.toLocaleString("en-IN")} college
            {hovered.colleges === 1 ? "" : "s"}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 text-xs text-ink-dim">
        <span>No registrations</span>
        <span className="h-2 w-8 rounded-sm" style={{ background: "#1a2124" }} />
        <span className="h-2 w-8 rounded-sm" style={{ background: "hsl(38,55%,37%)" }} />
        <span className="h-2 w-8 rounded-sm" style={{ background: "hsl(38,55%,52%)" }} />
        <span>Most registrations</span>
      </div>
    </div>
  );
}
