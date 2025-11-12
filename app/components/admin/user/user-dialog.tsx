import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import type { User, UserProps } from "~/types/user.types";
import { Loader2 } from "lucide-react";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSave: (data: UserProps) => Promise<void>;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserDialogProps) {
  const [loading, setLoading] = useState(false);
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
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        status: true,
        isMailable: true,
        isNotifiable: true,
        annex: "",
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {user ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {user
                ? "Modifica la información del usuario"
                : "Completa los datos para crear un nuevo usuario"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
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
                placeholder="Ingrese el anexo"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="status" className="text-base">
                    Estado
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Usuario {formData.status ? "activo" : "inactivo"}
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isMailable" className="text-base">
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
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isNotifiable" className="text-base">
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
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
