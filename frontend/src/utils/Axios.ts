import axios from "axios";

const TOKEN_KEY = 'wt_token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Inject Bearer token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token  = parsed?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { /* no token */ }
  }
  return config;
});

// On token_error → clear session and redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Unknown error';
    if (message === 'token_error' || err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(new Error(message));
  }
);

export default apiClient;