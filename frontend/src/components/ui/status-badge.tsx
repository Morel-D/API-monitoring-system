import React from "react";
import type { ServiceStatus } from "../../types";

type BadgeColor = "green" | "red" | "yellow" | "blue" | "gray" | "accent" | "purple" | "orange";

interface StatusBadgeProps {
  color?: BadgeColor;
  text?: string;
  status?: ServiceStatus;
}

const statusMap: Record<ServiceStatus, { classes: string; text: string }> = {
  UP:      { classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: 'UP'      },
  DOWN:    { classes: 'bg-red-500/10 text-red-400 border-red-500/20',             text: 'DOWN'    },
  SLOW:    { classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',       text: 'SLOW'    },
  UNKNOWN: { classes: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',          text: 'UNKNOWN' },
};

const colorMap: Record<string, string> = {
  green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  red:    'bg-red-500/10 text-red-400 border-red-500/20',
  yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  gray:   'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  accent: 'bg-accent/10 text-accent border-accent/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ color, text, status }) => {
  const resolved = status
    ? statusMap[status]
    : { classes: colorMap[color ?? 'gray'] ?? colorMap.gray, text: text ?? '' };

  return (
    <span className={`inline-flex items-center px-3 w-9 py-0.5 rounded text-[10px] font-mono font-medium border ${resolved.classes}`}>
      {resolved.text}
    </span>
  );
};

export default StatusBadge;