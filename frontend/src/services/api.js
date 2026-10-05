import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize API responses & handle 401 token expiration
api.interceptors.response.use(
  (response) => {
    // Return standard data payload
    return response.data;
  },
  (error) => {
    if (error.response) {
      // If server returns 401 Unauthorized or 403 Forbidden on protected endpoint
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Dispatch custom event so AuthContext/UI can react immediately without full page reload
        window.dispatchEvent(new Event("auth:unauthorized"));
      }

      // Extract server error message
      const serverMessage =
        error.response.data?.detail ||
        error.response.data?.message ||
        "An unexpected error occurred.";

      return Promise.reject(new Error(serverMessage));
    } else if (error.request) {
      return Promise.reject(new Error("Network error. Unable to reach backend server."));
    }
    return Promise.reject(error);
  }
);

export default api;
