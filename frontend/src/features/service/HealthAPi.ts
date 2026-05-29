import type { HealthLog } from "../../types/healthLog";
import apiClient from "../../utils/Axios";

export const healthApi = {
  getLogs: async (serviceId: number): Promise<HealthLog[]> => {
    const { data } = await apiClient.get(`/api/health/service/${serviceId}`);
    return data.data;
  },

  triggerCheck: async (serviceId: number): Promise<HealthLog> => {
    const { data } = await apiClient.post(`/api/service/${serviceId}/check`);
    return data.data;
  },
};