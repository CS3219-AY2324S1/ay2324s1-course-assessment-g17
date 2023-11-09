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
  refreshToken: string;
}

interface UserWithoutPassword {
  id: number;
}

interface JwtPayload {
  user: UserWithoutPassword;
  exp: number;
  iat: number;
}

const DEPLOYED_URL = "https://master.da377qx9p9syb.amplifyapp.com/";

// const storedRefreshTokens: string[] = [];
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
          // TODO2: and create a NULL for refreshToken x
          refreshToken: '',
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
      //TODO
      // Issue is needs to check that storedRefreshArray has no refreshToken before this.
      // If there is, need to remove all previous before pushing new one

      // Reasons:
      // 1. This will prevent logins on multiple devices, which may reduce collab room mayhem
      // (although perhaps matching could implement check to see if user is still in queue when matching, as can click away)
      // 2. This will prevent the server from getting so bloated with refresh tokens if some idiot keeps deleting his cookies without logging out
      // 3. This will prevent there from being 'defunct' refreshtokens still in server-side that hacker could get his hands on
      const { password: _, ...userWithoutPassword } = user;
      const accessToken = await generateAccessToken(userWithoutPassword);
      const refreshToken = await generateRefreshToken(userWithoutPassword);
      // Perhaps look up user and then push to a value there
      // storedRefreshTokens.push(refreshToken);

      // TODO2: Or simply just replace the value of refreshToken in user records
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken },
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
  //TODO
  // Issue is needs to check that storedRefreshArray has no other refreshToken besides refreshToken below.
  // If there is, need to remove all previous and refreshToken below
  
  // Clear server storage of refresh token

  // TODO2:
  // OR look up user and set refreshToken to NULL
  // const index = storedRefreshTokens.indexOf(req.cookies["refreshToken"]);
  // storedRefreshTokens.splice(index, 1);
  const accessToken = req.cookies["accessToken"];

  const decoded = (await authenticateAccessToken(
    accessToken,
  )) as JwtPayload;
  const userId = decoded.user.id;

  // try {
    
  // } catch (error) {
  //   res
  //     .status(401)
  //     .json({ errors: [{ msg: "Not authorized, access token failed" }] });
  // }

  // Fetch the latest user data from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      password: true,
      email: true,
      role: true,
      refreshToken: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: '' },
  });

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

export const deregister = async (req: Request, res: Response) => {
  const user = req.user!;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      languages: { set: [] },
    },
  });
  await prisma.user.delete({ where: { id: user.id } });
  //TODO
  // Issue is needs to check that storedRefreshArray has no other refreshToken besides refreshToken below.
  // If there is, need to remove all previous and refreshToken below
  // also need to delete refreshToken

  //TODO2 x
  // HERE if deleting user, don't need to bother to remove JWT token from user in db
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
    // const userId = req.user?.id; // user ID is used for identification
    const accessToken = req.cookies["accessToken"];

    const decoded = (await authenticateAccessToken(
      accessToken,
    )) as JwtPayload;
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
        refreshToken: true,
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
// TODO2: Or jusy delete this entire thing ffs
// export async function updateBothTokens(req: Request, res: Response) {
//   const refreshToken = req.cookies["refreshToken"];

//   if (!refreshToken) {
//     res
//       .status(401)
//       .json({ errors: [{ msg: "Not authorized, no refresh token" }] });
//   } else {
//     try {
//       const decoded = await authenticateRefreshToken(refreshToken);

//       // TODO2: modify here to get decoded.user?.id, 
//       // look up on prisma, then see if that refreshToken there matches refreshToken
//       if (!storedRefreshTokens.includes(refreshToken)) {
//         res.status(401).json({
//           errors: [
//             { msg: "Not authorized, refresh token not found in server" },
//           ],
//         });
//       } else {
//         const payload = decoded as JwtPayload;
//         const userId = payload.user.id;
//         const user = (await prisma.user.findFirst({
//           where: { id: userId },
//         })) as User;
//         if (!user) {
//           res
//             .status(401)
//             .json({ errors: [{ msg: "This username does not exist." }] });
//           return;
//         }
//         try {
//           const { password: _, ...userWithoutPassword } = user;
//           // TODO2: replace refreshToken after generating (if using PSQL) in db user record
//           const accessToken = await generateAccessToken(userWithoutPassword);
//           const refreshToken = await generateRefreshToken(userWithoutPassword);
//           storedRefreshTokens.push(refreshToken);

//           res.cookie("accessToken", accessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//           });
//           res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//           });

//           return res.status(200).json({
//             message: `Authorised, both refresh and access tokens refreshed.`,
//             accessToken,
//             refreshToken,
//           });
//         } catch (err) {
//           res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
//         }
//       }
//     } catch (error) {
//       res
//         .status(401)
//         .json({ errors: [{ msg: "Not authorized, invalid refresh token" }] });
//     }
//   }
// }

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
      //TODO2: Remove all refreshTokens from this user in order to ensure security
      // cos if resetting password might be because of security breach
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
        data: { password: hashedPassword, refreshToken: '' },
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

      // const userId = req.user?.id; // user ID is used for identification
      const payload = decoded as JwtPayload;
      const userWithoutPassword = payload.user;

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
          refreshToken: true,
        },
      });
    
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // TODO2: modify here to get decoded.user?.id, look up on prisma, then see if that refreshToken there matches refreshToken
      if (user.refreshToken != refreshToken) {
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

// TODO2: When creating access and refresh token, just use the immutable user information.
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
