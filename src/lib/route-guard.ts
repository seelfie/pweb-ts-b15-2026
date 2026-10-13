import type { Session } from "../types/index.js";
import { getSession, clearSession, isAdminLike } from "./session.js";

function keLogin(): void {
  window.location.href = "login.html";
}

export function requireLogin(): Session | null {
  const session = getSession();
  if (session === null) {
    keLogin();
    return null;
  }
  return session;
}

export function requireAdmin(): Session | null {
  const session = requireLogin();
  if (session === null) return null;

  if (!isAdminLike(session.role)) {
    keLogin();
    return null;
  }
  return session;
}

export function logout(): void {
  clearSession();
  keLogin();
}