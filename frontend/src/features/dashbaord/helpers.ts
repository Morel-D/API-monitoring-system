import type { ServiceStatus } from "../../types";
import type { RecentService } from "../../types/dashbaord";

export function resolveStatus(svc: RecentService): ServiceStatus {
  if (svc.latestSuccess === null || svc.latestSuccess === undefined) return 'UNKNOWN';
  if (svc.latestSuccess) return 'UP';
  return 'DOWN';
}

export function formatCheckedAt(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour:   '2-digit',
    minute: '2-digit',
  });
}

export function formatAvgResponse(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

export function calcUptimePercent(online: number, total: number): number {
  if (!total) return 0;
  return Math.round((online / total) * 100);
}