import type { DashboardMetrics } from "../../types/dashbaord";
import apiClient from "../../utils/Axios";


export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const { data } = await apiClient.get('/api/service/dashboard/metrics');
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};