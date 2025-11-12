import type { User } from "./user.types";

// Request de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Notificación del usuario
export interface Notification {
  id: number;
  title: string;
  subtitle: string;
  path: string;
  resource: string;
  action: string;
  resourceId: number;
  createdDate: string;
  updatedDate: string;
}

// Usuario con notificaciones (extendiendo el User de user.types)
export interface UserWithNotifications extends User {
  notification: Notification[];
}

// Payload de la respuesta de login
export interface Payload {
  token: string;
  user: User;
}

// Respuesta del endpoint de login
export interface LoginResponse {
  message: string;
  payload: Payload;
}

// Tipos de errores de autenticación
export enum AuthErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
