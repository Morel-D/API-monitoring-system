import type { ServiceStatus } from "../../types";

const cfg: Record<ServiceStatus, { label: string; cls: string }> = {
  UP:      { label: 'UP',      cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  DOWN:    { label: 'DOWN',    cls: 'bg-red-500/10     text-red-400     border-red-500/20'     },
  SLOW:    { label: 'SLOW',    cls: 'bg-amber-500/10   text-amber-400   border-amber-500/20'   },
  UNKNOWN: { label: 'UNKNOWN', cls: 'bg-zinc-500/10    text-zinc-400    border-zinc-500/20'    },
};

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const { label, cls } = cfg[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider border ${cls}`}>
      {label}
    </span>
  );
}