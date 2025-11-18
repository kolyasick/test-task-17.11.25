export type UserRole = "admin" | "user" | "moderator";
export type UserStatus = "active" | "inactive";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
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
  role: UserRole;
}

export interface NewUserForm {
  name: string;
  email: string;
  role: UserRole;
  sendWelcomeEmail: boolean;
}

export interface NewUserErrors {
  name: string;
  email: string;
}

export interface UserTableProps {
  title?: string;
  initialPageSize?: number;
  apiEndpoint?: string;
}

