import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  languages: string[];
}

interface JwtPayload {
  user: User;
  exp: number;
  iat: number;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

// basically verify access token
export async function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies["accessToken"]; // If JWT token is stored in a cookie

  if (!accessToken) {
    res.status(401).json({ errors: [{ msg: 'Not authorized, no access token' }] });
  } else {
    jwt.verify(
      accessToken, 
      ACCESS_TOKEN_SECRET,
      (err: Error | null) => {
        if (err) {
          res.status(401).json({ errors: [{msg: 'Not authorized, access token failed'}] });
          return;
        }
        next();
      }
    );
  }
}

export async function protectAdmin(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies["accessToken"]; // If JWT token is stored in a cookie
  const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;

  if (decoded.user.role == "ADMIN") {
    next();
  } else {
    res.status(401).json({ errors: [{msg: 'Not admin authorized, token failed'}] });
  };
}
