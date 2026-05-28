import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("Hello --> ")
    const message = err.response?.data?.message ?? err.message ?? "Unknown error";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;