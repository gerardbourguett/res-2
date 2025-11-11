export interface LoginRequest {
  email: string;
  password: string;
}

export interface Role {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
}

export interface Department {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
}

export interface Position {
  id: number;
  role: Role;
  department: Department;
  createdDate: string;
  updatedDate: string;
}

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

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  status: boolean;
  isMailable: boolean;
  isNotifiable: boolean;
  positions: Position[];
  notification: Notification[];
  isFirstLogin: boolean;
}

export interface Payload {
  token: string;
  user: User;
}

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
