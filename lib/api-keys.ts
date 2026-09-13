import { createHash, randomBytes } from "crypto";

export const API_KEY_PREFIX_LENGTH = 8;

export function generateApiKey(): {
  apiKey: string;
  keyHash: string;
  keyPrefix: string;
} {
  const raw = randomBytes(32).toString("hex");
  const keyPrefix = raw.slice(0, API_KEY_PREFIX_LENGTH);
  return {
    apiKey: `${keyPrefix}.${raw.slice(API_KEY_PREFIX_LENGTH)}`,
    keyHash: hashApiKey(raw),
    keyPrefix,
  };
}

export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}