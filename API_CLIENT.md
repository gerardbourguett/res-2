# API Client - Guía de Uso

Este documento explica cómo usar el cliente API configurado con autenticación automática.

## Características

- ✅ **Bearer Token Automático**: Agrega automáticamente el token de autenticación a todas las peticiones
- ✅ **Manejo de Errores 401**: Redirige automáticamente al login cuando el token expira
- ✅ **Type-Safe**: Soporte completo de TypeScript con genéricos
- ✅ **Reutilizable**: Métodos simples para todos los verbos HTTP

## Importación

```typescript
// Opción 1: Usar api (devuelve AxiosResponse completo)
import { api } from "~/lib/api";

// Opción 2: Usar apiData (devuelve solo data, perfecto para loaders)
import { apiData } from "~/lib/api";

// Opción 3: Acceso directo a la instancia de axios
import { axiosInstance } from "~/lib/api";
```

## Uso en React Router v7 Loaders

### Ejemplo 1: Cargar lista de usuarios

```typescript
import { apiData } from "~/lib/api";
import type { Route } from "./+types/users";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersResponse {
  message: string;
  payload: User[];
}

export async function clientLoader() {
  // apiData.get ya incluye el Bearer token automáticamente
  const users = await apiData.get<UsersResponse>("/users");
  return users;
}

export default function Users({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Usuarios</h1>
      {loaderData.payload.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Ejemplo 2: Cargar detalle de un usuario

```typescript
import { apiData } from "~/lib/api";
import type { Route } from "./+types/user";

interface UserDetailResponse {
  message: string;
  payload: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    positions: Array<{
      role: { name: string };
      department: { name: string };
    }>;
  };
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const user = await apiData.get<UserDetailResponse>(`/users/${params.id}`);
  return user;
}

export default function UserDetail({ loaderData }: Route.ComponentProps) {
  const { payload: user } = loaderData;

  return (
    <div>
      <h1>{user.firstname} {user.lastname}</h1>
      <p>{user.email}</p>
      <h2>Posiciones:</h2>
      {user.positions.map((pos, idx) => (
        <div key={idx}>
          {pos.role.name} - {pos.department.name}
        </div>
      ))}
    </div>
  );
}
```

## Uso en Actions (POST, PUT, DELETE)

### Ejemplo 3: Crear un usuario

```typescript
import { apiData } from "~/lib/api";
import { redirect } from "react-router";
import type { Route } from "./+types/create-user";

interface CreateUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  annex: string;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const userData: CreateUserRequest = {
    firstname: formData.get("firstname") as string,
    lastname: formData.get("lastname") as string,
    email: formData.get("email") as string,
    annex: formData.get("annex") as string,
  };

  // POST con Bearer token automático
  await apiData.post("/users", userData);

  return redirect("/dashboard/users");
}

export default function CreateUser() {
  return (
    <Form method="post">
      <input name="firstname" placeholder="Nombre" required />
      <input name="lastname" placeholder="Apellido" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="annex" placeholder="Anexo" required />
      <button type="submit">Crear Usuario</button>
    </Form>
  );
}
```

### Ejemplo 4: Actualizar un usuario

```typescript
import { apiData } from "~/lib/api";
import type { Route } from "./+types/edit-user";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const userId = params.id;

  const userData = {
    firstname: formData.get("firstname") as string,
    lastname: formData.get("lastname") as string,
    email: formData.get("email") as string,
  };

  // PUT con Bearer token automático
  await apiData.put(`/users/${userId}`, userData);

  return { success: true };
}
```

### Ejemplo 5: Eliminar un usuario

```typescript
import { apiData } from "~/lib/api";
import { redirect } from "react-router";
import type { Route } from "./+types/delete-user";

export async function clientAction({ params }: Route.ClientActionArgs) {
  // DELETE con Bearer token automático
  await apiData.delete(`/users/${params.id}`);

  return redirect("/dashboard/users");
}
```

## Uso con la respuesta completa (api vs apiData)

```typescript
import { api } from "~/lib/api";

// Si necesitas acceso a headers, status, etc.
export async function clientLoader() {
  const response = await api.get<UsersResponse>("/users");

  console.log(response.status); // 200
  console.log(response.headers); // Headers de la respuesta
  console.log(response.data); // Datos de la respuesta

  return response.data;
}
```

## Manejo de Errores

```typescript
import { apiData } from "~/lib/api";
import axios from "axios";

export async function clientLoader() {
  try {
    const users = await apiData.get("/users");
    return users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Error de axios
      if (error.response?.status === 404) {
        throw new Response("Usuarios no encontrados", { status: 404 });
      }

      if (error.response?.status === 500) {
        throw new Response("Error del servidor", { status: 500 });
      }
    }

    // Error genérico
    throw error;
  }
}
```

## Configuración Personalizada

```typescript
import { api } from "~/lib/api";

// Agregar query params
const response = await api.get("/users", {
  params: {
    page: 1,
    limit: 10,
    search: "john",
  },
});
// GET /users?page=1&limit=10&search=john

// Headers personalizados
const response = await api.post("/users", userData, {
  headers: {
    "X-Custom-Header": "value",
  },
});

// Timeout específico
const response = await api.get("/slow-endpoint", {
  timeout: 5000, // 5 segundos
});
```

## Interceptores Incluidos

El cliente API ya incluye estos interceptores:

1. **Request Interceptor**: Agrega automáticamente `Authorization: Bearer {token}` a cada petición
2. **Response Interceptor**: Si recibe un 401, limpia la sesión y redirige a `/auth/login`

## Notas Importantes

- ✅ No necesitas agregar `Authorization` headers manualmente
- ✅ No necesitas `${API_URL}` en las rutas, usa rutas relativas
- ✅ El token se obtiene automáticamente de `localStorage`
- ✅ Si el token expira (401), se redirige automáticamente al login
- ⚠️ Para el endpoint `/auth/signin` (login), usa `axios` directamente en `auth/service.ts`

## Diferencia: api vs apiData

```typescript
// api - Devuelve AxiosResponse completo
const response = await api.get<T>("/endpoint");
response.data; // Los datos
response.status; // 200, 201, etc.
response.headers; // Headers de respuesta

// apiData - Devuelve solo los datos (más limpio para loaders)
const data = await apiData.get<T>("/endpoint");
// data ya es el payload, no necesitas .data
```
