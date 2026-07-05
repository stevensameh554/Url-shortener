const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const storage = typeof localStorage === "undefined" ? null : localStorage;

let accessToken = storage?.getItem("linkpulse.accessToken") ?? "";

export function setAccessToken(token: string) {
  accessToken = token;
  storage?.setItem("linkpulse.accessToken", token);
}

export function clearAccessToken() {
  accessToken = "";
  storage?.removeItem("linkpulse.accessToken");
  storage?.removeItem("linkpulse.refreshToken");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(payload.error?.message ?? "Request failed");
  }
  if (response.status === 204) return undefined as T;
  const payload = await response.json();
  return payload.data as T;
}
