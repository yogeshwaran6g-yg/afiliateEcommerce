// src/services/http.js
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Create Axios instance
 */
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

/**
 * Request Interceptor
 * Attach auth token
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }


    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle success and error responses with toast notifications
 */
http.interceptors.response.use(
  (response) => {
    // Handle success responses with toast notifications
    const { data, config } = response;

    // Show success toast ONLY if explicitly enabled in the request config
    if (config.showSuccessToast) {
      const message = data?.message || "Operation completed successfully";
      toast.success(message, {
        autoClose: 3000,
      });
    }

    return data;
  },
  (error) => {
    const status = error?.response?.status;

    // Unauthorized → force logout
    if (status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      toast.error("Session expired. Please log in again.", {
        toastId: "auth-401",
        autoClose: 4000,
        onClose: () => {
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        },
      });

    }
    else if (status === 403) {
      toast.error("You don't have permission to perform this action.", {
        toastId: "auth-403",
      });
    }
    else if (status === 404) {
      toast.warn("Resource not found.", {
        toastId: "not-found",
      });
    }
    else if (status === 409) {
      toast.error("Resource already exists.", {
        toastId: "conflict",
      });
    }
    else if (status === 422) {
      toast.error("Invalid data.", {
        toastId: "validation",
      });
    }
    else if (status === 500) {
      toast.error("Internal server error.", {
        toastId: "server-error",
      });
    }
    else if (status === 503) {
      toast.error("Service unavailable.", {
        toastId: "service-unavailable",
      });
    }

    // Normalize error
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    return Promise.reject({
      status,
      message,
      raw: error,
    });
  }
);




export const api = {
  get: (url, params = {}, config = {}) => http.get(url, { ...config, params }),
  post: (url, data = {}, config = {}) => http.post(url, data, config),
  put: (url, data = {}, config = {}) => http.put(url, data, config),
  delete: (url, config = {}) => http.delete(url, config),
};

