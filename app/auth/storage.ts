// Utilidades para manejo de tokens en el cliente (SPA mode)

import type { User } from "~/types/user.types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const tokenStorage = {
  // Guardar access token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Obtener access token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Eliminar access token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Guardar usuario
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Obtener usuario
  getUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  },

  // Eliminar usuario
  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // Limpiar storage de autenticación
  clear(): void {
    this.removeToken();
    this.removeUser();
  },
};
