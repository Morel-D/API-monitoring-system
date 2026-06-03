import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginDTO, RegisterDTO } from '../../types/auth';
import { authApi } from './Authapi';

const TOKEN_KEY = 'wt_token';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;

  login:    (dto: LoginDTO)    => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  fetchMe:  ()                 => Promise<void>;
  logout:   ()                 => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:   null,
      user:    null,
      loading: false,

      login: async (dto) => {
        set({ loading: true });
        try {
          const auth = await authApi.login(dto);
          set({ token: auth.token, loading: false });
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },

      register: async (dto) => {
        set({ loading: true });
        try {
          const auth = await authApi.register(dto);
          set({ token: auth.token, loading: false });
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },

      fetchMe: async () => {
        set({ loading: true });
        try {
          const user = await authApi.getMe();
          set({ user, loading: false });
        } catch (e) {
          // token_error or expired — clear session
          set({ token: null, user: null, loading: false });
          throw e;
        }
      },

      logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem(TOKEN_KEY);
      },
    }),
    {
      name: TOKEN_KEY,
      partialize: (state) => ({ token: state.token }),
    }
  )
);