import { isRole } from "./guards.js";
const KEYS = {
    token: "auth_token",
    role: "auth_role",
    firstName: "auth_firstName",
};
export function saveSession(session) {
    localStorage.setItem(KEYS.token, session.token);
    localStorage.setItem(KEYS.role, session.role);
    localStorage.setItem(KEYS.firstName, session.firstName);
}
export function getSession() {
    const token = localStorage.getItem(KEYS.token);
    const role = localStorage.getItem(KEYS.role);
    const firstName = localStorage.getItem(KEYS.firstName);
    if (token === null || firstName === null || !isRole(role)) {
        return null;
    }
    return { token, role, firstName };
}
export function clearSession() {
    localStorage.removeItem(KEYS.token);
    localStorage.removeItem(KEYS.role);
    localStorage.removeItem(KEYS.firstName);
}
// moderator diperlakukan sama dengan admin
export function isAdminLike(role) {
    return role === "admin" || role === "moderator";
}
export function homePathFor(role) {
    if (isAdminLike(role)) {
        return "index.html";
    }
    return "ambil-antrian.html";
}
