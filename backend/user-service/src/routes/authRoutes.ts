import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);

// TODO
// router.get("/users/:id", userController.getUser);
// router.put("/users/:id", userController.updateUser);
// router.delete("/users/:id", userController.deleteUser);

export default router;
