import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, validationResult } from "express-validator";
import { Request, RequestHandler, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "../utils/auth";
import {
  User,
  UserWithoutPassword,
  JwtPayload,
} from "../middleware/authMiddleware";
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
          token: null,
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
      // Only allow one refreshToken at all times
      // 1. This will prevent logins on multiple devices, which may reduce collab room mayhem
      // (although perhaps matching could implement check to see if user is still in queue when matching, as can click away)
      // 2. This will prevent the server from getting so bloated with refresh tokens if some idiot keeps deleting his cookies without logging out
      // 3. This will prevent there from being 'defunct' refreshtokens still in server-side that hacker could get his hands on
      const userWithoutPassword = {
        id: user.id,
        role: user.role,
      } as UserWithoutPassword;
      const accessToken = await generateAccessToken(userWithoutPassword);
      const refreshToken = await generateRefreshToken(userWithoutPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: { token: refreshToken },
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({
        user: userWithoutPassword,
        message: `${user.username} has been authenticated`,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export async function logOut(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies["refreshToken"]; // If JWT token is stored in a cookie
    if (refreshToken) {
      const decoded = (await authenticateRefreshToken(
        refreshToken,
      )) as JwtPayload;
      const userId = decoded.user.id; // user ID is used for identification
      if (userId) {
        // Fetch the latest user data from the database
        const user = (await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            password: true,
            email: true,
            role: true,
            token: true,
          },
        })) as User;

        await prisma.user.update({
          where: { id: userId },
          data: { token: null },
        });
      }
    }
  } catch (error) {
    // This means access token has expired
    console.log("Cannot remove login refresh token from server: " + error);
    console.log(
      "You might have removed it somehow. Suggested that you login again to remove old refreshToken from server.",
    );
    console.log("Proceeding with rest of log out procedure...");
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.end();
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const accessToken = req.cookies["accessToken"]; // If JWT token is stored in a cookie

    const decoded = (await authenticateAccessToken(accessToken)) as JwtPayload;
    const userId = decoded.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Fetch the latest user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        role: true,
        token: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data in the response
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
    // Get decoded.user?.id, look up on prisma, then see if that refreshToken there matches refreshToken
    try {
      const decoded = (await authenticateRefreshToken(
        refreshToken,
      )) as JwtPayload;
      const userWithoutPassword = decoded.user;

      if (!userWithoutPassword.id) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Fetch the latest user data from the database
      const user = await prisma.user.findUnique({
        where: { id: userWithoutPassword.id },
        select: {
          id: true,
          username: true,
          password: true,
          email: true,
          role: true,
          token: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.token != refreshToken) {
        res.status(401).json({
          errors: [
            { msg: "Not authorized, refresh token not found in server" },
          ],
        });
      } else {
        const accessToken = await generateAccessToken(userWithoutPassword);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
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
