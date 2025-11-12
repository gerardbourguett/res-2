import { useNavigate } from "react-router";
import type { Route } from "./+types/new";
import { UserForm } from "~/components/admin/user/user-form";
import { apiData } from "~/lib/api";
import { useToast } from "~/hooks/use-toast";
import type { UserProps } from "~/types/user.types";
import { useState } from "react";

export function meta() {
  return [
    { title: "Nuevo Usuario - Dashboard" },
    { name: "description", content: "Crear un nuevo usuario" },
  ];
}

export default function NewUser() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UserProps) => {
    setIsLoading(true);
    try {
      await apiData.post("/users", data);
      toast({
        title: "Usuario creado",
        description: "El nuevo usuario se ha creado correctamente.",
      });
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario. Intente nuevamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
