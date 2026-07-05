import { api } from "../../lib/api";
import type { LinkDto } from "../../types/api";

export function createLink(input: { originalUrl: string; customAlias?: string; expiresAt?: string }) {
  return api<LinkDto>("/api/links", { method: "POST", body: JSON.stringify(input) });
}

export function updateLink(shortCode: string, input: Partial<Pick<LinkDto, "originalUrl" | "customAlias" | "status">> & { expiresAt?: string | null }) {
  return api<LinkDto>(`/api/links/${shortCode}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteLink(shortCode: string) {
  return api<void>(`/api/links/${shortCode}`, { method: "DELETE" });
}

export function getQr(shortCode: string) {
  return api<{ shortUrl: string; dataUrl: string }>(`/api/links/${shortCode}/qr`);
}
