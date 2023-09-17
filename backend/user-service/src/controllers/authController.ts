import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, validationResult } from "express-validator";
import { Request, RequestHandler, Response } from "express";
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
        res.status(400).json({
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
    jwt.sign(
      { user: userWithoutPassword },
      JWT_SECRET,
      (err: Error | null, token: string | undefined) => {
        if (err) {
          return next(err);
        }
        res
          .cookie("jwt", token, { httpOnly: true, secure: false })
          .json({ user: userWithoutPassword });
      }
    );
  },
];

export async function logOut(req: Request, res: Response) {
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
