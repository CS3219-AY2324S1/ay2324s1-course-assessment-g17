import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);
router.get("/deregister", authController.deregister);

// Protect the /logout route
router.get("/logout", authController.protect, authController.logOut);

// Protect the /currentUser route
router.get(
  "/currentUser",
  authController.protect,
  authController.getCurrentUser
);

export default router;
