import { getSession, clearSession, isAdminLike } from "./session.js";
import type { Session } from "../types/index.js";

export function requireAuth(): Session | null {
const session = getSession();

if (session === null) {
window.location.replace("login.html");
return null;
}

return session;
}

export function requireAdmin(): Session | null {
const session = requireAuth();

if (session === null) {
return null;
}

if (!isAdminLike(session.role)) {
window.location.replace("ambil-antrian.html");
return null;
}

return session;
}

export function logout(): void {
clearSession();
window.location.replace("login.html");
}