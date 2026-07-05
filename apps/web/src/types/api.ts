export type AuthUser = { sub: string; email: string; name: string };
export type AuthResponse = { user: AuthUser; accessToken: string; refreshToken: string; expiresAt: string };

export type LinkDto = {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string | null;
  status: "active" | "disabled" | "deleted";
  shortUrl: string;
  clickCount: number;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AnalyticsDto = {
  link: { shortCode: string; originalUrl: string; clickCount: number };
  totalClicks: number;
  uniqueVisitors: number;
  daily: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  devices: Record<string, number>;
  referrers: Record<string, number>;
  countries: Record<string, number>;
  events: Array<{ id: string; clickedAt: string; browser?: string; deviceType?: string; referrer?: string }>;
};
