import type { Service, ServiceFormValues } from "../../types";
import apiClient from "../../utils/Axios";


export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const { data } = await apiClient.get("/api/service");
    console.log("Display data --> ", data);
    return data.data;
  },

  getById: async (id: number): Promise<Service> => {
    const { data } = await apiClient.get(`/api/service/${id}`);
    return data.data;
  },

  create: async (payload: ServiceFormValues): Promise<Service> => {
    const { data } = await apiClient.post("/api/service", payload);
    return data.data;
  },

  update: async (id: number, payload: ServiceFormValues): Promise<Service> => {
    const { data } = await apiClient.put(`/api/service/${id}`, payload);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/service/${id}`);
  },

  check: async (id: number) => {
    const { data } = await apiClient.post(`/api/service/${id}/check`);
    return data.data;
  },
};