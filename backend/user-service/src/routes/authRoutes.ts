import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);
router.get("/logout", authController.logOut);
router.get("/currentUser", authController.getCurrentUser);

export default router;
