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

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const storedRefreshTokens: string[] = [];
// TODO: Make a MongoDB for refresh tokens
// IF TIME PERMITS

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
      const accessToken = await generateAccessToken(userWithoutPassword);
      const refreshToken = await generateRefreshToken(userWithoutPassword);
      storedRefreshTokens.push(refreshToken);

      res.cookie("accessToken", accessToken, { httpOnly: true, secure: false });
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
      
      return res.status(200).json({
        message: `${user.username} has been authenticated`,
        accessToken,
        refreshToken,
      });

    } catch (err) {
      return next(err);

    }
  },
];

export async function generateAccessToken(userWithoutPassword: object) {
  return jwt.sign( 
    { user: userWithoutPassword }, 
    ACCESS_TOKEN_SECRET, 
    { expiresIn: '30m' }
    );
}

export async function generateRefreshToken(userWithoutPassword: object) {
  return jwt.sign( 
    { user: userWithoutPassword }, 
    REFRESH_TOKEN_SECRET, 
    );
}

// This verify refresh token function also generates new access token after verification
export async function verifyRefreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies["refreshToken"]; // accessToken is stored in a cookie

  if (!refreshToken) {
    res.status(401).json({ errors: [{ msg: 'Not authorized, no refresh token' }] });
  } else {
    jwt.verify(
      refreshToken, 
      REFRESH_TOKEN_SECRET,
      async (err: Error | null, decoded: Object | undefined) => {
        // If error, or if refresh token is NOT in server storage
        if (err) { 
          res.status(401).json({ errors: [{ msg: 'Not authorized, invalid refresh token' }] });
        } else if (!storedRefreshTokens.includes(refreshToken)) {
          res.status(401).json({ errors: [{ msg: 'Not authorized, refresh token not found in server' }] });
        } else {
          const payload = decoded as JwtPayload;
          const userWithoutPassword = payload.user;
          const accessToken = await generateAccessToken(userWithoutPassword);
          res.cookie("accessToken", accessToken, { httpOnly: true, secure: false });

          return res.status(200).json({
            message: `Authorised, access token refreshed`,
            accessToken,
          });
        }
      }
    );
  }
}

export async function logOut(req: Request, res: Response) {
  if (res.headersSent) {
    // Response headers have already been sent by verifyAccessToken middleware, so don't send another response
    return;
  }

  // Clear server storage of refresh token
  const index = storedRefreshTokens.indexOf(req.cookies["refreshToken"]);
  // Remove only one item
  storedRefreshTokens.splice(index, 1);
 
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.end();
}

export async function getCurrentUser(req: Request, res: Response) {
  jwt.verify(
    req.cookies["accessToken"],
    ACCESS_TOKEN_SECRET,
    (err: Error | null, decoded: Object | undefined) => {
      if (err) {
        res.status(400).json({ errors: [{ msg: "Invalid JWT token" }] });
      } else {
        res.json(decoded);
      }
    }
  );
}
