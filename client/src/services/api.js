import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

/* ── Request interceptor — auto-attach JWT ── */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor — handle expired / invalid tokens ── */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Avoid redirect loop if already on /login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?session=expired";
      }
    }
    return Promise.reject(error);
  }
);

export default API;