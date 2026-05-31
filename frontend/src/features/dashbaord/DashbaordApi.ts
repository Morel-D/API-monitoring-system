import type { DashboardMetrics } from "../../types/dashbaord";
import apiClient from "../../utils/Axios";


export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const { data } = await apiClient.get('/api/service/dashboard/metrics');
    return data.data;
  },
};