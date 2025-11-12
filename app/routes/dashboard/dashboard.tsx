import React from "react";
import { Form } from "react-router";
import { userContext } from "~/auth/context";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Route } from "./+types/dashboard";

// clientLoader para obtener el usuario del contexto
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de control
          </p>
        </div>
        <Form method="post" action="/logout">
          <Button type="submit" variant="destructive">
            Cerrar Sesión
          </Button>
        </Form>
      </div>

      {loaderData?.user && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Detalles de tu cuenta actualmente conectada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm text-muted-foreground">
                {loaderData.user.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado:</span>
              <span
                className={`text-sm ${
                  loaderData.user.status
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {loaderData.user.status ? "Activo" : "Inactivo"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Métricas</CardTitle>
            <CardDescription>Estadísticas generales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Total de registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad</CardTitle>
            <CardDescription>Actividad reciente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">
              Acciones realizadas hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado</CardTitle>
            <CardDescription>Estado del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              Operativo
            </p>
            <p className="text-xs text-muted-foreground">
              Todos los sistemas funcionando
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
