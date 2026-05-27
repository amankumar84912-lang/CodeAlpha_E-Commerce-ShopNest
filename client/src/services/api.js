import axios from "axios";

/**
 * Production-grade Axios instance for ShopNest.
 *
 * Features:
 * - Environment-based base URL (VITE_API_URL)
 * - Extended timeout for Render cold starts (free tier takes 30-50s to wake)
 * - Auto JWT injection from localStorage
 * - Auto 401 → redirect to login
 * - Retry logic: retries once on network error or 502/503/504 (Render cold start)
 */

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 55000, // Render free tier cold starts can take up to 50s
  headers: {
    "Content-Type": "application/json",
  },
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

/* ── Response interceptor — auth guard + cold-start retry ── */
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const config = error.config;

    /* Auto-logout on 401 (expired / invalid token) */
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?session=expired";
      }
      return Promise.reject(error);
    }

    /*
     * Retry once on Render cold-start scenarios:
     * - Network error (ECONNRESET, timeout before server wakes)
     * - 502 Bad Gateway (Render spin-up in progress)
     * - 503 Service Unavailable
     * - 504 Gateway Timeout
     */
    const isRetriable =
      !config._retried &&
      (
        !error.response ||
        [502, 503, 504].includes(error.response?.status)
      );

    if (isRetriable) {
      config._retried = true;
      // Wait 3s before retry — gives Render time to start the container
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return API(config);
    }

    return Promise.reject(error);
  }
);

export default API;