import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, validationResult } from "express-validator";
import { Request, RequestHandler, Response } from "express";
import { comparePassword, hashPassword } from "../utils/auth";

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
  body("password").notEmpty().isLength({ min: 8 }),
  body("email").notEmpty().isEmail(),
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
          errors: `${err.meta?.target} is already taken by another user.`,
        });
      }
      return;
    }

    // TODO: create token

    res.sendStatus(200);
  },
];

export const logIn: RequestHandler[] = [
  body("username").notEmpty(),
  body("password").notEmpty(),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    const formData = matchedData(req) as LogInData;

    // login
    const user = await prisma.user.findFirst({
      where: {
        username: formData.username,
      },
    });

    if (!user || !comparePassword(formData.password, user.password)) {
      res.status(401).json({ formData });
      return;
    }

    // TODO: create token
    res.json({ user });
  },
];

export async function logOut(req: Request, res: Response) {
  // logout
  // TODO: destroy token
}

export async function getCurrentUser(req: Request, res: Response) {
  // decode jwt and return user
}
