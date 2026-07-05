import { api } from "../../lib/api";
import type { AnalyticsDto } from "../../types/api";

export function getAnalytics(shortCode: string) {
  return api<AnalyticsDto>(`/api/links/${shortCode}/analytics`);
}
