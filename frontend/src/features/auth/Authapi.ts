import type { AuthToken, AuthUser, LoginDTO, RegisterDTO } from "../../types/auth";
import apiClient from "../../utils/Axios";


export const authApi = {
  login: async (dto: LoginDTO): Promise<AuthToken> => {
    const { data } = await apiClient.post('/api/auth/login', dto);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  register: async (dto: RegisterDTO): Promise<AuthToken> => {
    const { data } = await apiClient.post('/api/auth/register', dto);
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  getMe: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get('/api/auth/me');
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};