import type { Service } from '../types';

export const DUMMY_SERVICES: Service[] = [
  { id: 1, name: 'Auth API',             url: 'https://api.prod/auth',       method: 'GET',  interval: 60,  status: 'UP',      latency: '87ms',   uptime: 99.8, lastCheck: '1 min ago' },
  { id: 2, name: 'Payment Gateway',      url: 'https://api.prod/payments',   method: 'POST', interval: 30,  status: 'DOWN',    latency: '—',      uptime: 91.2, lastCheck: '1 min ago' },
  { id: 3, name: 'Notification Service', url: 'https://api.prod/notify',     method: 'POST', interval: 120, status: 'SLOW',    latency: '810ms',  uptime: 97.1, lastCheck: '2 min ago' },
  { id: 4, name: 'User Service',         url: 'https://api.prod/users',      method: 'GET',  interval: 60,  status: 'UP',      latency: '112ms',  uptime: 99.9, lastCheck: '2 min ago' },
  { id: 5, name: 'Product Catalog',      url: 'https://api.prod/catalog',    method: 'GET',  interval: 60,  status: 'UP',      latency: '98ms',   uptime: 99.5, lastCheck: '3 min ago' },
  { id: 6, name: 'Search Service',       url: 'https://api.prod/search',     method: 'GET',  interval: 60,  status: 'UP',      latency: '143ms',  uptime: 98.7, lastCheck: '3 min ago' },
  { id: 7, name: 'File Storage',         url: 'https://api.prod/files',      method: 'GET',  interval: 300, status: 'UP',      latency: '201ms',  uptime: 99.2, lastCheck: '4 min ago' },
  { id: 8, name: 'Analytics API',        url: 'https://api.prod/analytics',  method: 'GET',  interval: 180, status: 'UNKNOWN', latency: '—',      uptime: 0,    lastCheck: 'Never'     },
];