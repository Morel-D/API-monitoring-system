import type { AutoCheck, Service, ServiceFormValues } from "../../types";
import type { HealthLog } from "../../types/healthLog";
import type { PagedResponse } from "../../types/pagination";
import apiClient from "../../utils/Axios";


export const serviceApi = {
  getAll: async (page = 0, size = 10): Promise<PagedResponse<Service>> => {
    const { data } = await apiClient.get('/api/service', {
      params: { page, size, sort: 'createdAt,desc' },
    });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  getById: async (id: number): Promise<Service> => {
    const { data } = await apiClient.get(`/api/service/${id}`);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  create: async (payload: ServiceFormValues): Promise<Service> => {
    console.log("CREATE DATA --> ", payload);
    const { data } = await apiClient.post('/api/service', payload);
    console.log("RECEIVED DATA --> ", data);

    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  update: async (id: number, payload: ServiceFormValues): Promise<Service> => {
    const { data } = await apiClient.put(`/api/service/${id}`, payload);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    const { data } = await apiClient.delete(`/api/service/${id}`);
    if (!data.success) throw new Error(data.message);
  },

  updateAutoCheck: async (id: number, dto: AutoCheck): Promise<void> => {
    const { data } = await apiClient.put(`/api/service/${id}/autocheck`, dto);
    if (!data.success) throw new Error(data.message);
  },

  triggerCheck: async (id: number): Promise<HealthLog> => {
    const { data } = await apiClient.post(`/api/service/${id}/check`);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  getHealthLogs: async (serviceId: number, page = 0, size = 10): Promise<PagedResponse<HealthLog>> => {
    const { data } = await apiClient.get(`/api/health/service/${serviceId}`, {
      params: { page, size, sort: 'checkedAt,desc' },
    });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
 
};