import { api, clearAccessToken, setAccessToken } from "../../lib/api";
import type { AuthResponse } from "../../types/api";

export async function registerAccount(input: { name: string; email: string; password: string }) {
  const response = await api<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(input) });
  setAccessToken(response.accessToken);
  if (typeof localStorage !== "undefined") localStorage.setItem("linkpulse.refreshToken", response.refreshToken);
  return response;
}

export async function loginAccount(input: { email: string; password: string }) {
  const response = await api<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(input) });
  setAccessToken(response.accessToken);
  if (typeof localStorage !== "undefined") localStorage.setItem("linkpulse.refreshToken", response.refreshToken);
  return response;
}

export async function logoutAccount() {
  const refreshToken = typeof localStorage === "undefined" ? null : localStorage.getItem("linkpulse.refreshToken");
  if (refreshToken) await api<void>("/api/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }).catch(() => undefined);
  clearAccessToken();
}
