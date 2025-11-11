import React from "react";
import { Outlet } from "react-router";
import { publicMiddleware } from "~/auth/middleware";
import type { Route } from "./+types/layout";

// Aplicar middleware público (redirige a dashboard si ya está autenticado)
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  publicMiddleware,
];

export default function Layout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-3">
      {/* Login Form Section - 1/3 */}
      <div className="flex items-center justify-center p-8 lg:col-span-1">
        <Outlet />
      </div>

      {/* Image Section - 2/3 */}
      <div className="relative lg:col-span-2">
        <img
          src="/background.jpg"
          alt="Modern workspace"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
          <p className="text-white">
            "Transforma tu forma de trabajar con nuestras herramientas diseñadas
            para aumentar tu productividad y creatividad."
          </p>
        </div>
      </div>
    </div>
  );
}
