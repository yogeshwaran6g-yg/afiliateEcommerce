// src/services/http.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Create Axios instance
 */
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
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

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle common errors
 */
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;

    // Unauthorized → force logout
    if (status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Optional: redirect to login
      //   if (window.location.pathname !== "/login") {
      //     window.location.href = "/login";
      //   }
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
  get: (url, params = {}) => http.get(url, { params }),
  post: (url, data = {}) => http.post(url, data),
  put: (url, data = {}) => http.put(url, data),
  delete: (url) => http.delete(url),
};

