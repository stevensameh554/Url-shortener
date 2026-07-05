import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generate = customAlphabet(alphabet, 7);

export function generateShortCode() {
  return generate();
}

export function isValidAlias(alias: string) {
  return /^[a-zA-Z0-9_-]{3,32}$/.test(alias);
}
