export interface RecentService {
  id: number;
  name: string;
  url: string;
  status: string;
  latestSuccess:   boolean | null;
  latestMessage:   string | null;     
  lastResponse: string; 
  lastChecked: string;  
}

export interface DashboardMetrics {
  totalServices: number;
  onlineServices: number;
  offlineServices: number;
  averageResponseTime: number;
  recentService: RecentService[];
}