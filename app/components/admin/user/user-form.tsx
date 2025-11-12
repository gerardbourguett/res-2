import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { User, UserProps } from "~/types/user.types";
import { Loader2, ArrowLeft } from "lucide-react";

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserProps) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, isLoading = false }: UserFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserProps>({
    firstname: "",
    lastname: "",
    email: "",
    status: true,
    isMailable: true,
    isNotifiable: true,
    annex: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        status: user.status,
        isMailable: user.isMailable,
        isNotifiable: user.isNotifiable,
        annex: user.annex,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/users")}
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {user ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <p className="text-muted-foreground">
            {user
              ? "Modifica la información del usuario"
              : "Completa los datos para crear un nuevo usuario"}
          </p>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="grid gap-6 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Datos básicos del usuario en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstname"
                    value={formData.firstname}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                    required
                    placeholder="Ingrese el nombre"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname">
                    Apellido <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastname"
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    required
                    placeholder="Ingrese el apellido"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="usuario@ejemplo.com"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annex">Anexo</Label>
                <Input
                  id="annex"
                  value={formData.annex}
                  onChange={(e) =>
                    setFormData({ ...formData, annex: e.target.value })
                  }
                  placeholder="Ingrese el anexo telefónico"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>
                Ajustes de estado y notificaciones del usuario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="status" className="text-base font-medium">
                    Estado del Usuario
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Usuario {formData.status ? "activo" : "inactivo"} en el
                    sistema
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isMailable" className="text-base font-medium">
                    Notificaciones por Email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones por correo electrónico
                  </p>
                </div>
                <Switch
                  id="isMailable"
                  checked={formData.isMailable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isMailable: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="isNotifiable"
                    className="text-base font-medium"
                  >
                    Notificaciones Push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones en tiempo real
                  </p>
                </div>
                <Switch
                  id="isNotifiable"
                  checked={formData.isNotifiable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isNotifiable: checked })
                  }
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/users")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
