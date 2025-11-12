import { redirect } from "react-router";
import { userContext } from "./context";
import { tokenStorage } from "./storage";
import { verifySession } from "./service";
import type { User } from "~/types/user.types";

// Función para obtener el usuario desde localStorage y verificar con el backend
async function getUserFromStorage(): Promise<User | null> {
  const token = tokenStorage.getToken();
  const cachedUser = tokenStorage.getUser();

  if (!token) {
    return null;
  }

  // Si tenemos usuario en cache, usarlo (para evitar llamadas innecesarias)
  if (cachedUser) {
    return cachedUser;
  }

  try {
    // Verificar el token con el backend
    return await verifySession();
  } catch (error) {
    console.error("Error verifying session:", error);
    // Limpiar storage si la verificación falla
    tokenStorage.clear();
    return null;
  }
}

// Client Middleware de autenticación (para SPA mode)
// Protege las rutas de /dashboard/** requiriendo autenticación
export async function authMiddleware({ context, request }: any) {
  // Primero verificar si ya tenemos el usuario en el contexto
  let user = context.get(userContext);

  // Si no hay usuario en el contexto, intentar obtenerlo del storage
  if (!user) {
    user = await getUserFromStorage();

    // Si no hay usuario autenticado, redirigir al login con la ruta de retorno
    if (!user) {
      const url = new URL(request.url);
      const redirectTo = encodeURIComponent(url.pathname + url.search);
      throw redirect(`/auth/login?redirect=${redirectTo}`);
    }

    // Guardar el usuario en el contexto para los loaders/actions
    context.set(userContext, user);
  }
}

// Función auxiliar para verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  const token = tokenStorage.getToken();
  const user = tokenStorage.getUser();
  return !!(token && user);
}

// Middleware público para rutas de autenticación
// Redirige a /dashboard si el usuario ya está autenticado
export async function publicMiddleware({ context, request }: any) {
  let user = context.get(userContext);

  // Si no hay usuario en el contexto, intentar obtenerlo del storage
  if (!user) {
    user = await getUserFromStorage();
  }

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirect");
    throw redirect(redirectTo || "/dashboard");
  }

  // Si no está autenticado, permitir acceso a la ruta pública
  context.set(userContext, null);
}
