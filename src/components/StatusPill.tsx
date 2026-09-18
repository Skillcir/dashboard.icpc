import type { TeamStatus } from "@/lib/types";

const STYLES: Record<TeamStatus, string> = {
  Accepted: "text-accepted border-accepted/40 bg-accepted/10",
  Pending: "text-pending border-pending/40 bg-pending/10",
  Canceled: "text-canceled border-canceled/40 bg-canceled/10",
};

export function StatusPill({ status }: { status: TeamStatus }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
