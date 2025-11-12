// Servicio de Autenticación
import {
  type LoginRequest,
  type LoginResponse,
  AuthError,
  AuthErrorCode,
} from "../types/auth.types";
import type { User } from "../types/user.types";
import { tokenStorage } from "./storage";
import { api } from "~/lib/api";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Función auxiliar para manejar errores de Axios y convertirlos en AuthError
 */
function handleAuthError(error: unknown): AuthError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      (error.response?.data as { message?: string })?.message || error.message;

    switch (status) {
      case 401:
        return new AuthError(
          message || "Credenciales incorrectas",
          AuthErrorCode.INVALID_CREDENTIALS,
          401,
        );
      case 403:
        return new AuthError(
          message || "No autorizado",
          AuthErrorCode.UNAUTHORIZED,
          403,
        );
      case 429:
        return new AuthError(
          message || "Demasiados intentos",
          AuthErrorCode.TOO_MANY_REQUESTS,
          429,
        );
      case 500:
      case 502:
      case 503:
        return new AuthError(
          message || "Error del servidor",
          AuthErrorCode.SERVER_ERROR,
          status,
        );
      default:
        if (!error.response) {
          return new AuthError(
            "Error de conexión",
            AuthErrorCode.NETWORK_ERROR,
          );
        }
        return new AuthError(
          message || "Error desconocido",
          AuthErrorCode.UNKNOWN_ERROR,
          status,
        );
    }
  }

  return new AuthError(
    error instanceof Error ? error.message : "Error desconocido",
    AuthErrorCode.UNKNOWN_ERROR,
  );
}

/**
 * Login - Autentica al usuario y retorna perfil y tokens
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await axios.post<LoginResponse>(
      `${API_URL}/auth/signin`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // Guardar token y usuario
    if (data.payload.token) {
      tokenStorage.setToken(data.payload.token);
    }

    if (data.payload.user) {
      tokenStorage.setUser(data.payload.user);
    }

    return data;
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Logout - Limpia la sesión local
 */
export function logout(): void {
  // Solo limpiar el storage local
  tokenStorage.clear();
}

/**
 * Verificar sesión - Valida el token actual con el backend
 * Usa api.get que automáticamente incluye el Bearer token
 */
export async function verifySession(): Promise<User> {
  try {
    const token = tokenStorage.getToken();

    if (!token) {
      throw new AuthError(
        "No hay token disponible",
        AuthErrorCode.UNAUTHORIZED,
      );
    }

    // api.get ya incluye automáticamente el Bearer token del interceptor
    const { data } = await api.get<{ payload: { user: User } }>("/auth/me");

    // Actualizar usuario en cache
    if (data.payload.user) {
      tokenStorage.setUser(data.payload.user);
    }

    return data.payload.user;
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Obtener usuario actual del cache
 */
export function getCurrentUser(): User | null {
  return tokenStorage.getUser();
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  const token = tokenStorage.getToken();
  const user = tokenStorage.getUser();
  return !!(token && user);
}
