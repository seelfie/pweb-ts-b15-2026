import { getSession, clearSession, isAdminLike } from "./session.js";
export function requireAuth() {
    const session = getSession();
    if (session === null) {
        window.location.replace("login.html");
        return null;
    }
    return session;
}
export function requireAdmin() {
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
export function logout() {
    clearSession();
    window.location.replace("login.html");
}
