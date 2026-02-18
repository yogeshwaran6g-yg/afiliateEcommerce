import axios from "axios";
import { toast } from "react-toastify";

// In a real app, this would come from import.meta.env.VITE_API_URL
const API_BASE_URL = "http://localhost:4000/api/v1";

const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        Accept: "application/json",
    },
});

/**
 * Request Interceptor
 * Attach admin auth token
 */
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Handle FormData vs JSON
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
 * Handle common errors and standardize output
 */
http.interceptors.response.use(
    (response) => {
        // Return only the data portion of the response
        return response.data;
    },
    (error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error?.message || "Something went wrong";

        // Handle specific status codes
        if (status === 401) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");

            toast.error("Session expired. Please log in again.", {
                toastId: "admin-auth-401",
                onClose: () => {
                    if (window.location.pathname !== "/admin/login") {
                        window.location.href = "/admin/login";
                    }
                },
            });
        }
        else if (status === 403) {
            toast.error("You don't have permission for this action.");
        }
        else if (status >= 500) {
            toast.error("Server error. Please try again later.");
        }
        else {
            // General error toast for other failures (400, 404, etc.)
            // We can choose to be more specific if needed
            toast.error(message);
        }

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

export default http;
