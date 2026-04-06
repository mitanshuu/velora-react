import axios from "axios";
import { LOGIN } from "./apiRoutes";
import { ROUTE_PATH } from "../Routes/routes.js";
import { checkStatusCodeUnauthorized } from "../utils/common.js";

export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const BASE_FILE_URL = import.meta.env.VITE_BASE_FILE_URL;

// Main API instance
const apiService = axios.create({
  baseURL: BASE_API_URL,
});

// Request Interceptor
apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.isMultipart) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes(LOGIN);
    if (
      checkStatusCodeUnauthorized(error.response?.status) &&
      !isLoginRequest
    ) {
      sessionStorage.removeItem("token");
      window.location.href = ROUTE_PATH.LOGIN;
    }
    return Promise.reject(error);
  },
);

// Upload API instance
const uploadService = axios.create({
  baseURL: BASE_FILE_URL,
});

// Upload Request Interceptor
uploadService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Upload Response Interceptor
uploadService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (checkStatusCodeUnauthorized(error.response?.status)) {
      sessionStorage.removeItem("token");
      window.location.href = ROUTE_PATH.LOGIN;
    }
    return Promise.reject(error);
  },
);

export { apiService, uploadService };
export default apiService;
