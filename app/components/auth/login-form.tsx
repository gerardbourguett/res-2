// Módulo: LoginForm
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";
import { Form, useActionData, useNavigation } from "react-router";

interface ActionData {
  error?: string;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Limpiar errores de servidor cuando el usuario empieza a escribir
  useEffect(() => {
    if (actionData?.error) {
      setValidationErrors({});
    }
  }, [email, password, actionData?.error]);

  // Validación en tiempo real (al perder foco)
  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "El correo electrónico es requerido",
      }));
    } else if (emailRegex.test(email)) {
      setValidationErrors((prev) => ({ ...prev, email: undefined }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Ingresa un correo electrónico válido",
      }));
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "La contraseña es requerida",
      }));
    } else if (password.length < 6) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "La contraseña debe tener al menos 6 caracteres",
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const hasErrors = validationErrors.email || validationErrors.password;

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bienvenido</h1>
        <p className="text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      {/* Mensaje de error del servidor - visible y accesible */}
      {actionData?.error && (
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <p className="font-medium">Error de autenticación</p>
          <p className="text-sm">{actionData.error}</p>
        </Alert>
      )}

      <Form
        method="post"
        className="space-y-6"
        replace
        aria-busy={isSubmitting}
        aria-describedby={actionData?.error ? "login-error" : undefined}
      >
        <div className="space-y-4">
          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo electrónico <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              required
              autoComplete="email"
              aria-invalid={!!validationErrors.email}
              aria-describedby={
                validationErrors.email ? "email-error" : undefined
              }
              disabled={isSubmitting}
            />
            {validationErrors.email && (
              <p id="email-error" className="text-sm text-red-600" role="alert">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Campo Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                Contraseña <span className="text-red-600">*</span>
              </Label>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              required
              minLength={6}
              autoComplete="current-password"
              aria-invalid={!!validationErrors.password}
              aria-describedby={
                validationErrors.password ? "password-error" : undefined
              }
              disabled={isSubmitting}
            />
            {validationErrors.password && (
              <p
                id="password-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.password}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !!hasErrors}
            aria-label={isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2" aria-hidden="true">
                  ⏳
                </span>{" "}
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </div>
      </Form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <button
            className="text-foreground hover:underline transition-colors font-medium"
            type="button"
            disabled={isSubmitting}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
