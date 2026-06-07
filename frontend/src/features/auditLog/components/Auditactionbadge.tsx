import type { AuditAction } from "../../../types/auditLog";
import { ACTION_META } from "../helper";


export function AuditActionBadge({ action }: { action: AuditAction }) {
  const meta = ACTION_META[action];
  if (!meta) return <span className="text-[10px] text-[#6b7280]">{action}</span>;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${meta.colorClass}`}>
      <i className={`ti ${meta.icon} text-[11px]`} aria-hidden />
      {meta.label}
    </span>
  );
}