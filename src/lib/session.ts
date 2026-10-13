import type { Role, Session } from "../types/index.js";
import { isRole } from "./guards.js";

const KEYS = {
  token: "auth_token",
  role: "auth_role",
  firstName: "auth_firstName",
} as const;

export function saveSession(session: Session): void {
  localStorage.setItem(KEYS.token, session.token);
  localStorage.setItem(KEYS.role, session.role);
  localStorage.setItem(KEYS.firstName, session.firstName);
}

export function getSession(): Session | null {
  const token = localStorage.getItem(KEYS.token);
  const role = localStorage.getItem(KEYS.role);
  const firstName = localStorage.getItem(KEYS.firstName);

  if (token === null || firstName === null || !isRole(role)) {
    return null;
  }
  return { token, role, firstName };
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.token);
  localStorage.removeItem(KEYS.role);
  localStorage.removeItem(KEYS.firstName);
}

// moderator diperlakukan sama dengan admin
export function isAdminLike(role: Role): boolean {
  return role === "admin" || role === "moderator";
}

export function homePathFor(role: Role): string {
  return isAdminLike(role) ? "index.html" : "operator.html";
}