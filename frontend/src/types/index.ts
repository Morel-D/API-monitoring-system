export type ServiceStatus = 'UP' | 'DOWN' | 'SLOW' | 'UNKNOWN';

export interface Service {
  id: number;
  name: string;
  url: string;
  status: string;        // comes as "true" / "false" from the API
  lastCheckedAt: string | null;
  createdAt: string;
}

export interface ServiceFormValues {
  name: string;
  url: string;
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