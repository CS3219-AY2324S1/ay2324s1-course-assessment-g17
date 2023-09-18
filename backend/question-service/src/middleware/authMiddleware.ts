import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import "dotenv/config";

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

export async function getCurrentUser(req: Request, res: Response) {
  jwt.verify(
    req.cookies["jwt"],
    JWT_SECRET,
    (err: Error | null, decoded: Object | undefined) => {
      if (err) {
        res.status(400).json({ errors: [{ msg: "Invalid JWT token" }] });
      } else {
        res.json(decoded);
      }
    }
  );
}
