export type ServiceStatus = 'UP' | 'DOWN' | 'SLOW' | 'UNKNOWN';

export interface Service {
  id:              number;
  name:            string;
  url:             string;
  status:          string;
  latestSuccess:   boolean | null;
  latestMessage:   string | null;
  autoCheckEnable: boolean;
  checkInterval:   number; 
  lastCheckedAt:   string | null;
  createdAt:       string;
}

export interface ServiceFormValues {
  name: string;
  url: string;
  autoCheckEnabled: boolean;
  checkInterval: number;
}

export interface AutoCheck {
  enabled: boolean;
  intervalMinutes: number;
}


// Format ISO date to a readable relative-ish string
export function formatCheckedAt(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}