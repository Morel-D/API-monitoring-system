export type ServiceStatus = 'UP' | 'DOWN' | 'SLOW' | 'UNKNOWN';

export interface Service {
  id: number;
  name: string;
  url: string;
  method: string;
  interval: number;
  status: ServiceStatus;
  latency: string;
  uptime: number;
  lastCheck: string;
}