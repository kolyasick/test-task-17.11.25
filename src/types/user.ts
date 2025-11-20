import type { StatusValue } from "@/constants/filters/status-filter.constants";
import type { RoleValue } from "@/constants/role/role.constants";


export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleValue;
  status: StatusValue;
  registrationDate: string;
  lastActivity: string;
  avatar: string | null;
  loginCount: number;
  postsCount: number;
  commentsCount: number;
}

export interface EditUserForm {
  name: string;
  email: string;
  role: RoleValue;
}

export interface NewUserForm {
  name: string;
  email: string;
  role: RoleValue;
  sendWelcomeEmail: boolean;
}

export interface NewUserErrors {
  name: string;
  email: string;
}


