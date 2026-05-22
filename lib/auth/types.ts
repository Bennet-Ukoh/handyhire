export type UserRole = "client" | "worker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  trade?: string;          // workers only
  location?: string;
  createdAt: string;
}

export interface SessionData {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  trade?: string;
}

export interface AuthResult {
  success: true;
  user: User;
}

export interface AuthError {
  success: false;
  error: string;
}

export type AuthOutcome = AuthResult | AuthError;

/* Shape returned from server actions to useActionState */
export interface ActionState {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
}

export const ROLE_REDIRECTS: Record<UserRole, string> = {
  client: "/client/dashboard",
  worker: "/worker/dashboard",
  admin:  "/admin/dashboard",
};
