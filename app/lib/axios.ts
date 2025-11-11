// Configuración de Axios con interceptores para autenticación
import axios from "axios";
import { tokenStorage } from "~/auth/storage";

const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios configurada
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request: Agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de response: Manejar errores 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si es 401, limpiar sesión y redirigir al login
    if (error.response?.status === 401) {
      tokenStorage.clear();
      globalThis.location.href = "/auth/login";
    }

    throw error;
  },
);

export default axiosInstance;
