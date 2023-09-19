import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import "dotenv/config";

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

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function protect(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["jwt"]; // If JWT token is stored in a cookie

  if (!token) {
    res.status(401).json({ errors: [{ msg: 'Not authorized, no token' }] });
  } else {
    try{
      const decoded = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ errors: [{msg: 'Not authorized, token failed'}] });
    }
  }
}

export async function protectAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["jwt"]; // If JWT token is stored in a cookie
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (decoded.user.role == "ADMIN") {
    next();
  } else {
    res.status(401).json({ errors: [{msg: 'Not admin authorized, token failed'}] });
  };
}
