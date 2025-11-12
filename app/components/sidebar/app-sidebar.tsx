import * as React from "react";
import { Form, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "../ui/sidebar";
import {
  LayoutDashboard,
  Ticket,
  User as UserIcon,
  Settings,
  FolderTree,
  Shield,
  Tag,
  Users,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import type { User } from "~/types/user.types";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User | null;
}

export function AppSidebar({ user, ...props }: Readonly<AppSidebarProps>) {
  const location = useLocation();

  // Determinar si el usuario es admin basado en sus roles
  const isAdmin =
    user?.positions?.some(
      (position) =>
        position.role.name.toLowerCase() === "admin" ||
        position.role.name.toLowerCase() === "administrador",
    ) ?? false;

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstname?.[0] || "";
    const lastInitial = user.lastname?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const userMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: Ticket,
      href: "/dashboard/tickets",
    },
    {
      id: "profile",
      label: "Perfil",
      icon: UserIcon,
      href: "/dashboard/profile",
    },
  ];

  const adminMenuItems = [
    {
      id: "categories",
      label: "Categorías",
      icon: FolderTree,
      href: "/dashboard/categories",
    },
    { id: "roles", label: "Roles", icon: Shield, href: "/dashboard/roles" },
    {
      id: "ticket-types",
      label: "Tipos de Tickets",
      icon: Tag,
      href: "/dashboard/ticket-types",
    },
    { id: "users", label: "Usuarios", icon: Users, href: "/dashboard/users" },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Sistema Tickets</span>
            <span className="text-xs text-muted-foreground">
              {isAdmin ? "Administrador" : "Usuario"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        {/* Menú Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                  >
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menú de Administración (solo para admins) */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                    >
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <Separator className="mb-2" />

        {/* Información del Usuario */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                {user.firstname} {user.lastname}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>
        )}

        {/* Botón de Cerrar Sesión */}
        <div className="px-3 pb-3">
          <Form method="post" action="/logout">
            <Button
              type="submit"
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </Button>
          </Form>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
