// Módulo: Ruta de Login (auth) - SPA Mode
import React from "react";
import { LoginForm } from "~/components/auth/login-form";
import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { login } from "~/auth/service";
import { AuthErrorCode } from "~/types/auth.types";

// clientAction para manejar el login en modo SPA
export async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validación básica del lado del servidor
  if (!email || !password) {
    return {
      error: "Por favor, completa todos los campos requeridos",
    };
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "Por favor, ingresa un correo electrónico válido",
    };
  }

  // Validación de longitud de contraseña
  if (password.length < 6) {
    return {
      error: "La contraseña debe tener al menos 6 caracteres",
    };
  }

  try {
    // El servicio ya guarda tokens y usuario
    await login({ email, password });

    // Obtener la ruta de retorno desde los parámetros de URL
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirect");

    // Redirigir a la ruta de retorno o al dashboard por defecto
    return redirect(redirectTo || "/dashboard");
  } catch (error: unknown) {
    console.error("Error de autenticación:", error);

    // Usar los códigos de error tipificados
    if (error instanceof Error && "code" in error) {
      const authError = error as { code: AuthErrorCode; message: string };

      switch (authError.code) {
        case AuthErrorCode.INVALID_CREDENTIALS:
          return {
            error: "Credenciales incorrectas. Verifica tu email y contraseña.",
          };
        case AuthErrorCode.TOO_MANY_REQUESTS:
          return {
            error:
              "Demasiados intentos de login. Por favor, espera unos minutos.",
          };
        case AuthErrorCode.SERVER_ERROR:
          return {
            error:
              "Error en el servidor. Por favor, intenta nuevamente más tarde.",
          };
        case AuthErrorCode.NETWORK_ERROR:
          return {
            error: "Error de conexión. Verifica tu conexión a internet.",
          };
        default:
          return {
            error: authError.message || "Error al iniciar sesión.",
          };
      }
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión. Intenta nuevamente.",
    };
  }
}

export default function Login() {
  return (
    <div className="">
      <LoginForm />
    </div>
  );
}
