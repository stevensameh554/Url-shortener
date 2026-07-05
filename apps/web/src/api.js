const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
}

export function shortenLink(payload, accessToken) {
  return api("/api/shorten", {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: JSON.stringify(payload)
  });
}

export function getAnalytics(shortCode) {
  return api(`/api/links/${shortCode}/analytics`);
}

export function getDashboardStats(accessToken) {
  return api("/api/dashboard/stats", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}
