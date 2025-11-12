import { type ColumnDef } from "@tanstack/react-table";
import type { User } from "~/types/user.types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, ArrowUpDown } from "lucide-react";

interface ColumnsActions {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
}

export const createColumns = (actions: ColumnsActions): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm text-muted-foreground">
          #{row.getValue("id")}
        </div>
      );
    },
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { firstname, lastname } = row.original;
      return (
        <div className="font-medium">
          {firstname} {lastname}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="lowercase text-sm text-muted-foreground">
          {row.original.email}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status ? "default" : "destructive"}
          className="font-medium"
        >
          {status ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "annex",
    header: "Anexo",
    cell: ({ row }) => {
      const annex = row.original.annex;
      return (
        <div className="text-center font-medium">
          {annex || <span className="text-muted-foreground">N/A</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "positions",
    header: "Posiciones",
    cell: ({ row }) => {
      const positions = row.original.positions;
      if (!positions || positions.length === 0) {
        return <div className="text-muted-foreground">Sin posiciones</div>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {positions.slice(0, 2).map((position) => (
            <Badge key={position.id} variant="secondary" className="text-xs">
              {position.role.name}
            </Badge>
          ))}
          {positions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{positions.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isMailable",
    header: "Email",
    cell: ({ row }) => {
      const isMailable = row.original.isMailable;
      return (
        <Badge variant={isMailable ? "default" : "secondary"}>
          {isMailable ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isNotifiable",
    header: "Notificaciones",
    cell: ({ row }) => {
      const isNotifiable = row.original.isNotifiable;
      return (
        <Badge variant={isNotifiable ? "default" : "secondary"}>
          {isNotifiable ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Fecha Creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return (
        <div className="text-sm text-muted-foreground font-mono">
          {date.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copiar email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.onView(user)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => actions.onDelete(user)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
