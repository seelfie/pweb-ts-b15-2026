import type { LoginCredentials, LoginResult, Role } from "../types/index.js";
import { isRecord, isRole } from "./guards.js";

const BASE_URL = "https://dummyjson.com";

function parseLoginResult(data: unknown): LoginResult {
  if (isRecord(data)) {
    const { accessToken, firstName } = data;
    if (typeof accessToken === "string" && typeof firstName === "string") {
      return { accessToken, firstName };
    }
  }
  throw new Error("Format respons login tidak dikenali.");
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (res.status === 400) {
    throw new Error("Username atau password salah.");
  }
  if (!res.ok) {
    throw new Error(`Server bermasalah (HTTP ${res.status}).`);
  }

  const data: unknown = await res.json();
  return parseLoginResult(data);
}

export async function fetchRole(token: string): Promise<Role> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data pengguna.");
  }

  const data: unknown = await res.json();
  if (isRecord(data) && isRole(data.role)) {
    return data.role;
  }
  throw new Error("Role pengguna tidak valid.");
}