// API Client - Métodos reutilizables con autenticación automática
import { axiosInstance } from "./axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Cliente API con métodos HTTP comunes
 * Usa axiosInstance que incluye interceptores para:
 * - Agregar automáticamente el Bearer token
 * - Manejar errores 401 (redirigir a login)
 */
export const api = {
  /**
   * GET request
   * @param url - Endpoint URL (relativa al baseURL)
   * @param config - Configuración adicional de axios
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.get<T>(url, config);
  },

  /**
   * POST request
   * @param url - Endpoint URL (relativa al baseURL)
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional de axios
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(url, data, config);
  },

  /**
   * PUT request
   * @param url - Endpoint URL (relativa al baseURL)
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional de axios
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.put<T>(url, data, config);
  },

  /**
   * PATCH request
   * @param url - Endpoint URL (relativa al baseURL)
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional de axios
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.patch<T>(url, data, config);
  },

  /**
   * DELETE request
   * @param url - Endpoint URL (relativa al baseURL)
   * @param config - Configuración adicional de axios
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.delete<T>(url, config);
  },
};

/**
 * Helper para extraer solo los datos de la respuesta
 * Útil para usar directamente en loaders de React Router
 */
export const apiData = {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

// Exportar también la instancia de axios por si se necesita acceso directo
export { axiosInstance } from "./axios";
