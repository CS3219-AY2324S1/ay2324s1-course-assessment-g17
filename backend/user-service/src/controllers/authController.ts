import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, validationResult } from "express-validator";
import { Request, RequestHandler, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "../utils/auth";
import jwt from "jsonwebtoken";

interface LogInData {
  username: string;
  password: string;
}

interface SignUpData extends LogInData {
  email: string;
  confirmPassword: string;
}

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

export const signUp: RequestHandler[] = [
  body("username").notEmpty(),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password should have length of at least 8."),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("email should be a valid email."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword cannot be empty.")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("password does not match confirmPassword"),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    const formData = matchedData(req) as SignUpData;

    const hashedPassword = hashPassword(formData.password);

    try {
      const newUser = await prisma.user.create({
        data: {
          username: formData.username,
          password: hashedPassword,
          email: formData.email,
          role: Role.USER,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({
          errors: [
            { msg: `${err.meta?.target} is already taken by another user.` },
          ],
        });
      }
      return;
    }

    res.sendStatus(200);
  },
];

export const logIn: RequestHandler[] = [
  body("username").notEmpty(),
  body("password").notEmpty(),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    const formData = matchedData(req) as LogInData;

    const user = await prisma.user.findFirst({
      where: {
        username: formData.username,
      },
      include: {
        languages: true,
      },
    });

    if (!user) {
      res
        .status(401)
        .json({ errors: [{ msg: "This username does not exist." }] });
      return;
    }

    if (!comparePassword(formData.password, user.password)) {
      res.status(401).json({ errors: [{ msg: "Wrong password." }] });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    
    try {
      const token = await generateToken(userWithoutPassword);
      res
        .cookie("jwt", token, { httpOnly: true, secure: false })
        .json({ user: userWithoutPassword });
    } catch (err) {
      return next(err);
    }

  },
];

export async function generateToken(userWithoutPassword: Object) {
  // Calculate the token expiration time (30 minutes from now)
  const expirationTimeInSeconds = 30 * 60; 
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

  jwt.sign(
    { user: userWithoutPassword,
      exp: expirationTimestamp,
    },
    JWT_SECRET,
  );
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["jwt"]; // If JWT token is stored in a cookie

  if (!token) {
    res.status(401).json({ errors: [{ msg: 'Not authorized, no token' }] });
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Generate a new token whenever the protect function is called!
      const userWithoutPassword = decoded.user;
      try {
        const token = await generateToken(userWithoutPassword);
        res
          .cookie("jwt", token, { httpOnly: true, secure: false })
          .json({ user: userWithoutPassword });
        next();
      } catch (err) {
        // Probably a 500 Internal Server Error response?
        res.status(500).json({ errors: [{msg: 'Internal server error'}] });
      }

    } catch (err) {
      res.status(401).json({ errors: [{msg: 'Not authorized, token failed'}] });
    }
  }
}

export async function logOut(req: Request, res: Response) {
  if (res.headersSent) {
    // Response headers have already been sent by the protect middleware, so don't send another response
    return;
  }
  res.clearCookie("jwt").end();
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
