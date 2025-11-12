import { apiData } from "~/lib/api";
import type { Route } from "./+types/users";
import type { User } from "~/types/user.types";
import UserComponent from "~/components/admin/user/user-component";

// Tipo de respuesta esperado del API
interface UsersResponse {
  message: string;
  payload: User[];
}

export function meta() {
  return [
    { title: "Dashboard - Usuarios" },
    { name: "description", content: "Lista de usuarios" },
  ];
}

export async function clientLoader() {
  // apiData.get ya incluye el Bearer token automáticamente
  const users = await apiData.get<UsersResponse>("/users");
  return users;
}

export default function Users({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
        <p className="text-muted-foreground">
          Administración y gestión de usuarios del sistema
        </p>
      </div>
      <UserComponent users={loaderData.payload} />
    </div>
  );
}
