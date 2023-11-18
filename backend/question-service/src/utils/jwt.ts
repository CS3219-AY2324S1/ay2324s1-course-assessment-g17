import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

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
