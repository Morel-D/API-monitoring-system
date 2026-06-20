import axios from "axios";

const TOKEN_KEY = 'wt_token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
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


// Helper — extract correlationId from response 
function extractCorrelationId(response?: {
  headers?: Record<string, string>;
  data?: { correlationId?: string };
}): string | undefined {
  if (!response) return undefined;
  return (
    response.headers?.['x-correlation-id'] ??
    response.headers?.['X-Correlation-Id'] ??
    response.data?.correlationId
  );
}


// Response interceptor 
apiClient.interceptors.response.use(
  (response: any) => {
    const correlationId = extractCorrelationId(response);
    if (correlationId) {
      (response as any)._correlationId = correlationId;
    }
    return response;
  },
  (err) => {
    const message       = err.response?.data?.message ?? err.message ?? 'Unknown error';
    const correlationId = extractCorrelationId(err.response);
 
    // Session expired
    if (message === 'token_error' || err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
 
    // Attach correlationId to the error so hooks can forward it to the toast
    const error = new Error(message) as Error & { correlationId?: string };
    error.correlationId = correlationId;
 
    return Promise.reject(error);
  }
);

export default apiClient;