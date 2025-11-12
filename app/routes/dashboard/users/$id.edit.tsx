import { useNavigate } from "react-router";
import type { Route } from "./+types/$id.edit";
import { UserForm } from "~/components/admin/user/user-form";
import { apiData } from "~/lib/api";
import { useToast } from "~/hooks/use-toast";
import type { User, UserProps } from "~/types/user.types";
import { useState } from "react";

interface UserResponse {
  message: string;
  payload: User;
}

export function meta({ data }: Route.MetaArgs) {
  const user = data?.payload;
  return [
    {
      title: `Editar Usuario: ${user?.firstname} ${user?.lastname} - Dashboard`,
    },
    { name: "description", content: "Editar información del usuario" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response = await apiData.get<UserResponse>(`/users/${params.id}`);
  return response;
}

export default function EditUser({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const user = loaderData.payload;

  const handleSubmit = async (data: UserProps) => {
    setIsLoading(true);
    try {
      await apiData.patch(`/users/${user.id}`, data);
      toast({
        title: "Usuario actualizado",
        description: "Los cambios se guardaron correctamente.",
      });
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario. Intente nuevamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <UserForm user={user} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
