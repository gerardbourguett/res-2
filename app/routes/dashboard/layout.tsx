import React from "react";
import { Outlet } from "react-router";
import { authMiddleware } from "~/auth/middleware";
import { userContext } from "~/auth/context";
import type { Route } from "./+types/layout";

// Exportar el clientMiddleware de autenticación (SPA mode)
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];

// clientLoader para obtener el usuario y pasarlo al componente
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          {loaderData?.user && (
            <p className="text-sm text-gray-600">
              Bienvenido, {loaderData.user.firstname} {loaderData.user.lastname}
            </p>
          )}
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
