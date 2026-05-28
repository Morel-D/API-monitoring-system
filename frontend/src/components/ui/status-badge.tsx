import React from "react";
import type { ServiceStatus } from "../../types";

type BadgeColor = "green" | "red" | "yellow" | "blue" | "gray" | "accent" | "purple" | "orange";

interface StatusBadgeProps {
  color?: BadgeColor;
  text?: string;
  status?: ServiceStatus;
}

const statusMap: Record<ServiceStatus, { color: BadgeColor; text: string }> = {
  UP:      { color: "green",  text: "UP"      },
  DOWN:    { color: "red",    text: "DOWN"    },
  SLOW:    { color: "yellow", text: "SLOW"    },
  UNKNOWN: { color: "gray",   text: "UNKNOWN" },
};

const getColorClasses = (color: BadgeColor) => {
  switch (color) {
    case "green":  return "bg-green-100 text-green-700";
    case "red":    return "bg-red-100 text-red-700";
    case "yellow": return "bg-yellow-100 text-yellow-700";
    case "blue":   return "bg-blue-100 text-blue-700";
    case "gray":   return "bg-gray-100 text-gray-700";
    case "accent": return "bg-accent/20 text-accent";
    case "purple": return "bg-purple-100 text-purple-700";
    case "orange": return "bg-orange-100 text-orange-700";
    default:       return "bg-gray-100 text-gray-700";
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ color, text, status }) => {
  const resolved = status ? statusMap[status] : { color: color ?? "gray", text: text ?? "" };

  return (
    <span className={`px-2 py-1 text-center mx-1 text-xs font-medium rounded ${getColorClasses(resolved.color as BadgeColor)}`}>
      {resolved.text}
    </span>
  );
};

export default StatusBadge;