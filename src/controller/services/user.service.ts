import { createHash, randomBytes } from "crypto";

export function generateSalt() {
  return randomBytes(64).toString('hex');
}

export function hashPassword(password: string, salt: string) {
  const hash = createHash('sha256');
  hash.update(password + salt);
  return hash.digest('hex');
}

export function generateVerificationCode() {
  return Math.floor(Math.random() * 1000000);
}
