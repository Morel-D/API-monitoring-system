export function resolveStatus(status: string): 'UP' | 'DOWN' {
  return status === 'true' ? 'UP' : 'DOWN';
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