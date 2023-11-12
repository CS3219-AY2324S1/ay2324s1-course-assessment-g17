import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const TEMPORARY_TOKEN_SECRET = process.env.TEMPORARY_TOKEN_SECRET as string;

export async function generateAccessToken(userWithoutPassword: object) {
  return jwt.sign({ user: userWithoutPassword }, ACCESS_TOKEN_SECRET, {
    expiresIn: "5s",
  });
}

export async function generateRefreshToken(userWithoutPassword: object) {
  return jwt.sign({ user: userWithoutPassword }, REFRESH_TOKEN_SECRET);
}

export async function authenticateAccessToken(
  accessToken: string,
): Promise<Object> {
  return new Promise<Object>((resolve, reject) => {
    jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET,
      async (err: Error | null, decoded: Object | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as Object);
        }
      },
    );
  });
}

export async function authenticateRefreshToken(
  refreshToken: string,
): Promise<Object> {
  return new Promise<Object>((resolve, reject) => {
    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      async (err: Error | null, decoded: Object | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as Object);
        }
      },
    );
  });
}

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
