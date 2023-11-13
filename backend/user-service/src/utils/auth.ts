import bcrypt from "bcryptjs";
import crypto from "crypto";

// Password Hashing
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 8);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function randomPassword(passwordLength: number = 16): string {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const array = new Uint32Array(chars.length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}
