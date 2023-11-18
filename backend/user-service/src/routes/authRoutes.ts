import express from "express";
import * as AuthController from "../controllers/authController";
import * as AuthMiddleWare from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", AuthController.logIn);
router.post("/signup", AuthController.signUp);

router.get("/logout", AuthController.logOut);
router.get("/deregister", AuthController.deregister);
router.post("/send-reset-email", AuthController.sendResetEmail);
router.post("/reset-password", AuthController.resetPassword);

// Update the user's profile
router.put("/update-profile", AuthController.updateUserProfile);

export default router;
