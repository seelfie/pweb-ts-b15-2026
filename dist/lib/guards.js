export function isRecord(value) {
    return typeof value === "object" && value !== null;
}
export function isRole(value) {
    return value === "admin" || value === "moderator" || value === "user";
}
