import express from "express";
import * as AuthController from "../controllers/authController";
import * as AuthMiddleWare from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", AuthController.logIn);
router.post("/signup", AuthController.signUp);

// Protected refresh token routes
router.get("/token", AuthController.verifyRefreshToken)

// Protected access token routes
router.get("/logout", AuthMiddleWare.verifyAccessToken, AuthController.logOut);
router.get("/currentUser", AuthMiddleWare.verifyAccessToken, AuthController.getCurrentUser);

export default router;
