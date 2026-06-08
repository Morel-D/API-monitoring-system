import type { AuditAction } from "../../types/auditLog";


export function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
}

interface ActionMeta {
  label:      string;
  category:   'auth' | 'service' | 'monitoring';
  colorClass: string;
  icon:       string;
}

export const ACTION_META: Record<AuditAction, ActionMeta> = {
  USER_LOGIN:              { label: 'Login',                category: 'auth',       colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',       icon: 'ti-login'       },
  USER_REGISTER:           { label: 'Register',             category: 'auth',       colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',       icon: 'ti-user-plus'   },
  USER_CREATED_SERVICE:    { label: 'Created service',      category: 'service',    colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: 'ti-circle-plus' },
  USER_UPDATED_SERVICE:    { label: 'Updated service',      category: 'service',    colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',     icon: 'ti-edit'        },
  USER_DELETED_SERVICE:    { label: 'Deleted service',      category: 'service',    colorClass: 'bg-red-500/10 text-red-400 border-red-500/20',           icon: 'ti-trash'       },
  USER_TRIGGERED_CHECK:    { label: 'Triggered check',      category: 'monitoring', colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',  icon: 'ti-player-play' },
  USER_ENABLED_AUTOCHECK:  { label: 'Enabled auto-check',  category: 'monitoring', colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: 'ti-clock-check' },
  USER_DISABLED_AUTOCHECK: { label: 'Disabled auto-check', category: 'monitoring', colorClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',         icon: 'ti-clock-off'   },
};

export type AuditFilter = 'ALL' | 'auth' | 'service' | 'monitoring';

export const FILTERS: { label: string; value: AuditFilter }[] = [
  { label: 'All',        value: 'ALL'        },
  { label: 'Auth',       value: 'auth'       },
  { label: 'Services',   value: 'service'    },
  { label: 'Monitoring', value: 'monitoring' },
];