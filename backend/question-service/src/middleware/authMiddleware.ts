import { Request, Response, NextFunction } from "express";
import { authenticateAccessToken } from "../utils/jwt";

export interface User {
  id: number;
  password: string;
  username: string;
  email: string;
  role: string;
  languages: { id: number; language: string }[];
  token?: string;
}

export interface UserWithoutPassword {
  id: number;
  role: string;
}

export interface JwtPayload {
  user: UserWithoutPassword;
  exp: number;
  iat: number;
}

// basically verify access token
export async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = req.cookies["accessToken"]; // If JWT token is stored in a cookie

  if (!accessToken) {
    res
      .status(401)
      .json({ errors: [{ msg: "Not authorized, no access token" }] });
  } else {
    try {
      // const decoded = (await authenticateAccessToken(
      //   accessToken,
      // )) as JwtPayload;
      // req.user = decoded.user;

      await authenticateAccessToken(accessToken);

      next();
    } catch (error) {
      res
        .status(401)
        .json({ errors: [{ msg: "Not authorized, access token failed" }] });
    }
  }
}

export async function protectAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = req.cookies["accessToken"]; // If JWT token is stored in a cookie
  const decoded = (await authenticateAccessToken(accessToken)) as JwtPayload;

  if (decoded.user.role == "ADMIN") {
    next();
  } else {
    res
      .status(401)
      .json({ errors: [{ msg: "Not admin authorized, token failed" }] });
  }
}
