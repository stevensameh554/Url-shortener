import { HttpError } from "./http-error.js";

const privateHostPatterns = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./
];

export function normalizeAndValidateUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new HttpError(400, "Invalid URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new HttpError(400, "URL must use http or https");
  }

  if (privateHostPatterns.some((pattern) => pattern.test(parsed.hostname))) {
    throw new HttpError(400, "Private or local URLs are not allowed");
  }

  return parsed.toString();
}
