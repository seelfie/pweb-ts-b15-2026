import { getSession, clearSession, isAdminLike } from "./session.js";
function keLogin() {
    window.location.href = "login.html";
}
export function requireLogin() {
    const session = getSession();
    if (session === null) {
        keLogin();
        return null;
    }
    return session;
}
export function requireAdmin() {
    const session = requireLogin();
    if (session === null)
        return null;
    if (!isAdminLike(session.role)) {
        keLogin();
        return null;
    }
    return session;
}
export function logout() {
    clearSession();
    keLogin();
}
