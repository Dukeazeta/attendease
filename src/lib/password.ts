import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(plainPassword: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plainPassword, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  const [salt, expectedHash] = storedHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = scryptSync(plainPassword, salt, expectedBuffer.length);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
