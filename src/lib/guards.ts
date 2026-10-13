import type { Role } from "../types/index.js";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isRole(value: unknown): value is Role {
  return value === "admin" || value === "moderator" || value === "user";
}