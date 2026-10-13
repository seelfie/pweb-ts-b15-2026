export type Role = "admin" | "moderator" | "user";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  firstName: string;
}

export interface Session {
  token: string;
  role: Role;
  firstName: string;
}