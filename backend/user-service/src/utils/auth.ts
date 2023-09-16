import bcrypt from "bcryptjs";

// Password Hashing
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 8);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// JWT
