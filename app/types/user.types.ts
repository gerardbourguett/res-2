// Rol del usuario
export interface RoleUser {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
}

// Departamento del usuario
export interface DepartmentUser {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
}

// Posición del usuario (relación entre rol y departamento)
export interface PositionUser {
  id: number;
  role: RoleUser;
  department: DepartmentUser;
  createdDate: string;
  updatedDate: string;
}

// Usuario completo (estructura del payload)
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  status: boolean;
  resetToken: string | null;
  resetTokenExpiration: string | null;
  isMailable: boolean;
  isNotifiable: boolean;
  createdDate: string;
  updatedDate: string;
  positions: PositionUser[];
  annex: string;
  isFirstLogin: boolean;
}

// Respuesta del endpoint GET user
export interface GetUserResponse {
  message: string;
  payload: User;
}

// Props para crear/actualizar usuario
export interface UserProps {
  firstname: string;
  lastname: string;
  email: string;
  status: boolean;
  isMailable: boolean;
  isNotifiable: boolean;
  roles?: RoleUser[];
  departments?: DepartmentUser[];
  annex: string;
}
