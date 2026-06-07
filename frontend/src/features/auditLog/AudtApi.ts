import type { AuditLog } from "../../types/auditLog";
import apiClient from "../../utils/Axios";


export const auditApi = {
  getAll: async (): Promise<AuditLog[]> => {
    const { data } = await apiClient.get('/api/audit');
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  getById: async (id: number): Promise<AuditLog> => {
    const { data } = await apiClient.get(`/api/audit/${id}`);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};