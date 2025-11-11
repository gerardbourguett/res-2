// Módulo: Ruta de Logout - SPA Mode
import { redirect } from "react-router";
import { logout } from "~/auth/service";

// Función auxiliar para cerrar sesión
async function handleLogout() {
  // Usar el servicio de logout que invalida tokens
  await logout();

  return redirect("/auth/login");
}

// clientAction para manejar el logout (POST) en SPA mode
export async function clientAction() {
  return handleLogout();
}

// clientLoader para manejar GET requests (si alguien visita /logout directamente)
export async function clientLoader() {
  return handleLogout();
}
