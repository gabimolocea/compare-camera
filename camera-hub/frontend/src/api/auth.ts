import apiClient from "./client";
import type { TokenResponse, User } from "../types/api";

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/login/", { email, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function register(email: string, username: string, password: string): Promise<User> {
  const { data } = await apiClient.post<User>("/auth/register/", { email, username, password });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me/");
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("access_token");
}
