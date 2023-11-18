import jwt from "jsonwebtoken";

const TEMPORARY_TOKEN_SECRET = process.env.TEMPORARY_TOKEN_SECRET as string;

// is using email or the entire object better
export function generateTemporaryToken(email: string): string {
  return jwt.sign({ email }, TEMPORARY_TOKEN_SECRET, { expiresIn: "1h" });
}

export function verifyTemporaryToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, TEMPORARY_TOKEN_SECRET) as {
      email: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}
