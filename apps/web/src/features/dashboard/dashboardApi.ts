import { api } from "../../lib/api";
import type { LinkDto } from "../../types/api";

export function listLinks(params = "") {
  return api<{ items: LinkDto[]; total: number; page: number; pageSize: number }>(`/api/links${params}`);
}
