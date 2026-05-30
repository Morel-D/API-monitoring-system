export type ServiceStatus = 'UP' | 'DOWN' | 'SLOW' | 'UNKNOWN';

export interface Service {
  id: number;
  name: string;
  url: string;
  status: string;             // "true" | "false"
  autoCheckEnable: boolean;
  checkInterval: number;      // minutes
  lastCheckedAt: string | null;
  createdAt: string;

}

export interface ServiceFormValues {
  name: string;
  url: string;
  autoCheckEnable: boolean;
  checkInterval: number;
}

export interface AutoCheck {
  enabled: boolean;
  intervalMinutes: number;
}

// Normalise the raw API status string to our UI status
export function resolveStatus(status: string | null): ServiceStatus {
  if (status === 'true')  return 'UP';
  if (status === 'false') return 'DOWN';
  return 'UNKNOWN';
}

// Format ISO date to a readable relative-ish string
export function formatCheckedAt(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}