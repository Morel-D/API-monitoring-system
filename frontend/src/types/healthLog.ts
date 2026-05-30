import type { Service } from ".";

export interface HealthLog {
  id: number;
  statusCode: number;
  responseTime: string;   // e.g. "PT4.336S"
  sucess: boolean;        // note: typo from backend, keep as-is
  message: string;
  status: string;         // "true" | "false"
  checkedAt: string;
  service: Service;
}

// Parse "PT4.336S" → "4.34s"
export function parseResponseTime(pt: string): string {
  const match = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?/);
  if (!match) return pt;
  const h = parseInt(match[1] ?? '0');
  const m = parseInt(match[2] ?? '0');
  const s = parseFloat(match[3] ?? '0');
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s.toFixed(0)}s`;
  return `${(s * 1000).toFixed(0)}ms`;
}