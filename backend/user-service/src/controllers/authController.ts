import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, validationResult } from "express-validator";
import { Request, RequestHandler, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "../utils/auth";
import transporter from "../utils/nodemailer";
import { generateTemporaryToken, verifyTemporaryToken } from "../utils/jwt";

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

      return res.status(200).json({
        user: userWithoutPassword,
        message: `${userWithoutPassword.username} has been authenticated`,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export async function logOut(req: Request, res: Response) {
  res.end();
}

export const deregister = async (req: Request, res: Response) => {
  const user = req.user!;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      languages: { set: [] },
    },
  });
  await prisma.user.delete({ where: { id: user.id } });
  res.end();
};

export const sendResetEmail: RequestHandler[] = [
  body("email").notEmpty().isEmail(),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    const { email } = matchedData(req);

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res.status(404).json({ errors: [{ msg: "User not found." }] });
        return;
      }

      const resetToken = generateTemporaryToken(email);
      const mailOptions = {
        from: "your_email@example.com",
        to: email,
        subject: "Password Reset",
        text: `Click the link below to reset your password: http://localhost:8000/reset-password?token=${resetToken}`,
      };

      transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
        if (error) {
          console.error(error);
          res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
        } else {
          console.log("Email sent: " + info.response);
          res
            .status(200)
            .json({ message: "Password reset link sent successfully." });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
    }
  },
];

export const resetPassword: RequestHandler[] = [
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password should have length of at least 8."),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    const { password } = matchedData(req);
    const { token } = req.query;

    try {
      const isValidToken = await verifyTemporaryToken(token as string);

      if (!isValidToken) {
        const errorMessage = "Invalid token: Unable to verify token.";
        console.error(errorMessage);
        res.status(400).json({ errors: [{ msg: errorMessage }] });
        return;
      }

      const user = await prisma.user.findFirst({
        where: { email: isValidToken.email },
      });

      if (!user) {
        res.status(400).json({ errors: [{ msg: "User not found." }] });
        return;
      }

      const hashedPassword = hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
    }
  },
];

export const updateUserProfile: RequestHandler[] = [
  body("username").notEmpty().withMessage("Username cannot be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .isEmail()
    .withMessage("Invalid email format!"),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { username, email, languages } = req.body;

      const languageIds = [];

      for (const language of languages) {
        let existingLanguages = await prisma.language.findMany({
          where: {
            language: language.language,
          },
        });

        const existingLanguage = existingLanguages[0];

        if (existingLanguage) {
          languageIds.push(existingLanguage.id);
        } else {
          const newLanguage = await prisma.language.create({
            data: { language: language },
          });
          languageIds.push(newLanguage.id);
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        include: {
          languages: true,
        },
        data: {
          username: username,
          email: email,
          languages: {
            set: [],
            connect: languageIds.map((id) => ({ id: id })),
          },
        },
      });

      res.json({
        message: "User profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        res.status(409).json({
          errors: [
            { msg: `${error.meta?.target} is already taken by another user.` },
          ],
        });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  },
];
