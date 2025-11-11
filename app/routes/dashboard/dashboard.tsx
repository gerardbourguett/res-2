import React from "react";
import { Form } from "react-router";
import { userContext } from "~/auth/context";
import type { Route } from "./+types/dashboard";

// clientLoader para obtener el usuario del contexto
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Principal</h2>
      {loaderData?.user && (
        <div className="mb-4">
          <p>Email: {loaderData.user.email}</p>
          <p>Estado: {loaderData.user.status ? "Activo" : "Inactivo"}</p>
        </div>
      )}
      <Form method="post" action="/logout">
        <button
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          Cerrar Sesión
        </button>
      </Form>
    </div>
  );
}
