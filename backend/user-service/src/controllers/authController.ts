import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, validationResult } from "express-validator";
import { Request, RequestHandler, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

    // TODO: hash password

    try {
      const newUser = await prisma.user.create({
        data: {
          username: formData.username,
          password: formData.password,
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
      select: { username: true, email: true, userLanguage: true },
      where: {
        username: formData.username,
        password: formData.password,
      },
    });

    if (!user) {
      res.status(401).json({ formData });
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
