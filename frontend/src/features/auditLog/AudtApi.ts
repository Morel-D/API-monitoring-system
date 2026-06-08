import type { AuditLog, PagedResponse } from "../../types/auditLog";
import apiClient from "../../utils/Axios";


export const auditApi = {
  getAll: async (page = 0, size = 10): Promise<PagedResponse<AuditLog>> => {
    const { data } = await apiClient.get('/api/audit', {
      params: { page, size, sort: 'createdAt,desc' },
    });
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
 
  getById: async (id: number): Promise<AuditLog> => {
    const { data } = await apiClient.get(`/api/audit/${id}`);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};