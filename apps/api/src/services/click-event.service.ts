import crypto from "node:crypto";
import type { Request } from "express";
import { UAParser } from "ua-parser-js";
import { createClickEvent } from "../repositories/click-event.repository.js";
import { logger } from "../utils/logger.js";

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function recordClickEvent(linkId: string, req: Request) {
  const userAgent = req.header("user-agent") ?? "";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const ip = req.ip ?? req.socket.remoteAddress ?? "";
  const referrer = req.header("referer") ?? req.header("referrer") ?? undefined;
  const data: Parameters<typeof createClickEvent>[0] = {
    linkId,
    visitorHash: hash(`${ip}|${userAgent}`),
    userAgent,
    browser: result.browser.name ?? "Unknown",
    operatingSystem: result.os.name ?? "Unknown",
    deviceType: result.device.type ?? "desktop"
  };
  if (ip) data.ipHash = hash(ip);
  if (referrer) data.referrer = referrer;
  const country = req.header("cf-ipcountry");
  if (country) data.country = country;
  void createClickEvent(data).catch((error) => logger.warn("Click analytics recording failed", error));
}
