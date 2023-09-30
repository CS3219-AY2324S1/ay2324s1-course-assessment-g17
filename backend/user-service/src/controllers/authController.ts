import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, validationResult } from "express-validator";
import { Request, RequestHandler, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "../utils/auth";
import {
  generateAccessToken,
  generateRefreshToken,
  authenticateAccessToken,
  authenticateRefreshToken,
} from "../utils/jwt";

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
  password: string;
  username: string;
  email: string;
  role: string;
  languages: { id: number; language: string }[];
}

interface UserWithoutPassword {
  id: number;
  username: string;
  email: string;
  role: string;
  languages: { id: number; language: string }[];
}

interface JwtPayload {
  user: UserWithoutPassword;
  exp: number;
  iat: number;
}

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
    try {
      const { password: _, ...userWithoutPassword } = user;
      const accessToken = await generateAccessToken(userWithoutPassword);
      const refreshToken = await generateRefreshToken(userWithoutPassword);
      storedRefreshTokens.push(refreshToken);

      res.cookie("accessToken", accessToken, { httpOnly: true, secure: false });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
      });

      return res.status(200).json({
        message: `${userWithoutPassword.username} has been authenticated`,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export async function logOut(req: Request, res: Response) {
  // Clear server storage of refresh token
  const index = storedRefreshTokens.indexOf(req.cookies["refreshToken"]);
  storedRefreshTokens.splice(index, 1);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.end();
}

export async function getCurrentUser(req: Request, res: Response) {
  const accessToken = req.cookies["accessToken"];

  try {
    const decoded = await authenticateAccessToken(accessToken);
    res.json(decoded);
  } catch (error) {
    res.status(400).json({ errors: [{ msg: "Invalid JWT token" }] });
  }
}

// update after updating user profile
export async function updateBothTokens(req: Request, res: Response) {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    res
      .status(401)
      .json({ errors: [{ msg: "Not authorized, no refresh token" }] });
  } else {
    try {
      const decoded = await authenticateRefreshToken(refreshToken);

      if (!storedRefreshTokens.includes(refreshToken)) {
        res
          .status(401)
          .json({
            errors: [
              { msg: "Not authorized, refresh token not found in server" },
            ],
          });
      } else {
        const payload = decoded as JwtPayload;
        const userId = payload.user.id;
        const user = (await prisma.user.findFirst({
          where: { id: userId },
        })) as User;
        if (!user) {
          res
            .status(401)
            .json({ errors: [{ msg: "This username does not exist." }] });
          return;
        }
        try {
          const { password: _, ...userWithoutPassword } = user;
          const accessToken = await generateAccessToken(userWithoutPassword);
          const refreshToken = await generateRefreshToken(userWithoutPassword);
          storedRefreshTokens.push(refreshToken);

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
          });

          return res.status(200).json({
            message: `Authorised, both refresh and access tokens refreshed.`,
            accessToken,
            refreshToken,
          });
        } catch (err) {
          res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
        }
      }
    } catch (error) {
      res
        .status(401)
        .json({ errors: [{ msg: "Not authorized, invalid refresh token" }] });
    }
  }
}

// This verify refresh token function also generates new access token after verification
export async function updateAccessToken(req: Request, res: Response) {
  const refreshToken = req.cookies["refreshToken"]; // accessToken is stored in a cookie

  if (!refreshToken) {
    res
      .status(401)
      .json({ errors: [{ msg: "Not authorized, no refresh token" }] });
  } else {
    try {
      const decoded = await authenticateRefreshToken(refreshToken);

      if (!storedRefreshTokens.includes(refreshToken)) {
        res
          .status(401)
          .json({
            errors: [
              { msg: "Not authorized, refresh token not found in server" },
            ],
          });
      } else {
        const payload = decoded as JwtPayload;
        const userWithoutPassword = payload.user;
        const accessToken = await generateAccessToken(userWithoutPassword);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
        });

        return res.status(200).json({
          message: `Authorized, access token refreshed`,
          accessToken,
        });
      }
    } catch (error) {
      res
        .status(401)
        .json({ errors: [{ msg: "Not authorized, invalid refresh token" }] });
    }
  }
}
