import dns from "node:dns/promises";
import net from "node:net";
import { HttpError } from "./http-error.js";

const privateHostnames = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

export async function validatePublicUrl(input: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new HttpError(400, "Invalid URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) throw new HttpError(400, "Only HTTP and HTTPS URLs are allowed");
  if (parsed.username || parsed.password) throw new HttpError(400, "URLs with credentials are not allowed");
  if (privateHostnames.has(parsed.hostname.toLowerCase())) throw new HttpError(400, "Private or local URLs are not allowed");
  if (isPrivateIp(parsed.hostname)) throw new HttpError(400, "Private or local URLs are not allowed");

  let addresses: Array<{ address: string }> = [];
  try {
    addresses = await dns.lookup(parsed.hostname, { all: true });
  } catch {
    if (process.env.NODE_ENV !== "test") throw new HttpError(400, "URL host could not be resolved");
  }
  if (addresses.some((entry) => isPrivateIp(entry.address))) throw new HttpError(400, "Private or local URLs are not allowed");

  parsed.hash = "";
  return parsed.toString();
}

export function isPrivateIp(host: string) {
  const version = net.isIP(host);
  if (version === 0) return false;
  if (version === 6) return host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80");
  const parts = host.split(".").map(Number);
  const [a = 0, b = 0] = parts;
  return a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254) || a === 0;
}
