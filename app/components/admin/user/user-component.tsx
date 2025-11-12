import { useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { DataTable } from "~/components/shared/data-table";
import type { User } from "~/types/user.types";
import { createColumns } from "./columns";
import { Button } from "~/components/ui/button";
import { Plus, Users } from "lucide-react";
import { apiData } from "~/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useToast } from "~/hooks/use-toast";

export default function UserComponent({ users }: Readonly<{ users: User[] }>) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const revalidator = useRevalidator();
  const { toast } = useToast();

  const handleEdit = (user: User) => {
    navigate(`/dashboard/users/${user.id}/edit`);
  };

  const handleView = (user: User) => {
    // Implementar vista de detalles si es necesario
    navigate(`/dashboard/users/${user.id}/edit`);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await apiData.delete(`/users/${userToDelete.id}`);
      toast({
        title: "Usuario eliminado",
        description: `${userToDelete.firstname} ${userToDelete.lastname} ha sido eliminado correctamente.`,
      });
      revalidator.revalidate();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Lista de Usuarios</h3>
            <p className="text-sm text-muted-foreground">
              Gestiona los usuarios del sistema y sus permisos
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate("/dashboard/users/new")}
          size="default"
          className="shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Buscar por nombre, apellido o email..."
        globalFilterFn={(user, filterValue) => {
          const searchValue = filterValue.toLowerCase();
          const firstname = user.firstname.toLowerCase();
          const lastname = user.lastname.toLowerCase();
          const email = user.email.toLowerCase();

          return (
            firstname.includes(searchValue) ||
            lastname.includes(searchValue) ||
            email.includes(searchValue)
          );
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              usuario{" "}
              <span className="font-semibold">
                {userToDelete?.firstname} {userToDelete?.lastname}
              </span>{" "}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
