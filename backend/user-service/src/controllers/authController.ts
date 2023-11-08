import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { body, matchedData, param, validationResult } from "express-validator";
import { Request, RequestHandler, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "../utils/auth";
import {
  generateAccessToken,
  generateRefreshToken,
  authenticateAccessToken,
  authenticateRefreshToken,
  generateTemporaryToken,
  verifyTemporaryToken,
} from "../utils/jwt";
import transporter from "../utils/nodemailer";

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
  githubId?: number;
}

interface UserWithoutPassword {
  id: number;
  username: string;
  email: string;
  role: string;
  languages: { id: number; language: string }[];
  githubId?: number;
}

interface JwtPayload {
  user: UserWithoutPassword;
  exp: number;
  iat: number;
}

const DEPLOYED_URL = "https://master.da377qx9p9syb.amplifyapp.com/";
const OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID as string;
const OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET as string;

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
    .withMessage("Email should be a valid email."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirmation password cannot be empty.")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password does not match confirmation password."),
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

export const oAuthAuthenticate: RequestHandler[] = [
  body("code").notEmpty(),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
  
    const formData = new FormData();
    formData.append('client_id', OAUTH_CLIENT_ID as string);
    formData.append('client_secret', OAUTH_CLIENT_SECRET as string);
    formData.append('code', req.body.code as string);
    console.log('formData', formData);
    const response = await fetch(`https://github.com/login/oauth/access_token`, {
        method: "POST",
        body: formData,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        },
    });

    const resp = await response.text();
    const params = JSON.parse(resp);
    const githubAccessToken = params['access_token'];
    const user_resp = await fetch(`https://api.github.com/user`, {
      headers: { Authorization: `token ${githubAccessToken}` },
    });
    
    const githubUser = await user_resp.json();
    const githubUserId = githubUser['id'] as number;
    const user = await prisma.user.findFirst({ where: { githubId: githubUserId } });

    if (user !== null) {
      // User already exists in the database
      try {
        const { password: _, ...userWithoutPassword } = user;
        const appAccessToken = await generateAccessToken(userWithoutPassword);
        const refreshToken = await generateRefreshToken(userWithoutPassword);
        storedRefreshTokens.push(refreshToken);
  
        res.cookie("accessToken", appAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("githubAccessToken", githubAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
  
        return res.status(200).json({
          user: userWithoutPassword,
          message: `${userWithoutPassword.username} has been authenticated`,
          accessToken: appAccessToken,
          refreshToken,
          githubAccessToken: githubAccessToken,
        });
      } catch (err) {
        return next(err);
      }
    }

    // New user
    const githubName = githubUser['name'];
    const githubUsername = githubUser['login'];
    const githubEmail = githubUser['email'];

    return res.status(200).json(
      {
        user: null,
        githubDetails: {
          githubId: githubUserId,
          username: githubUsername,
          name: githubName,
          email: githubEmail,
        },
        message: 'Successful OAuth login for new user',
      }
    );
  },
];

export const oAuthNewUser: RequestHandler[] = [
  body("code").notEmpty(),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
  
    const formData = new FormData();
    formData.append('client_id', OAUTH_CLIENT_ID as string);
    formData.append('client_secret', OAUTH_CLIENT_SECRET as string);
    formData.append('code', req.body.code as string);
    console.log('formData', formData);
    const response = await fetch(`https://github.com/login/oauth/access_token`, {
        method: "POST",
        body: formData,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        },
    });

    const resp = await response.text();
    const params = JSON.parse(resp);
    const githubAccessToken = params['access_token'];
    const user_resp = await fetch(`https://api.github.com/user`, {
      headers: { Authorization: `token ${githubAccessToken}` },
    });
    
    const githubUser = await user_resp.json();
    const githubUserId = githubUser['id'] as number;
    const user = await prisma.user.findFirst({ where: { githubId: githubUserId } });

    if (user !== null) {
      // User already exists in the database
      try {
        const { password: _, ...userWithoutPassword } = user;
        const appAccessToken = await generateAccessToken(userWithoutPassword);
        const refreshToken = await generateRefreshToken(userWithoutPassword);
        storedRefreshTokens.push(refreshToken);
  
        res.cookie("accessToken", appAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("githubAccessToken", githubAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
  
        return res.status(200).json({
          user: userWithoutPassword,
          message: `${userWithoutPassword.username} has been authenticated`,
          accessToken: appAccessToken,
          refreshToken,
          githubAccessToken: githubAccessToken,
        });
      } catch (err) {
        return next(err);
      }
    }

    // New user
    const githubName = githubUser['name'];
    const githubUsername = githubUser['login'];
    const githubEmail = githubUser['email'];

    return res.status(200).json(
      {
        user: null,
        githubDetails: {
          githubId: githubUserId,
          username: githubUsername,
          name: githubName,
          email: githubEmail,
        },
        message: 'Successful OAuth login for new user',
      }
    );
  },
];

export const deregister = async (req: Request, res: Response) => {
  const user = req.user!;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      languages: { set: [] },
    },
  });
  await prisma.user.delete({ where: { id: user.id } });
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
};

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const userId = req.user?.id; // user ID is used for identification

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Fetch the latest user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        languages: true,
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
        res.status(401).json({
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
            secure: true,
            sameSite: "none",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
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
        text: `Click the link below to reset your password: ${DEPLOYED_URL}reset-password?token=${resetToken}`,
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
        res.status(401).json({
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
