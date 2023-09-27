import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/users", userController.getUsers);

// TODO
// router.get("/users/:id", userController.getUser);
// router.put("/users/:id", userController.updateUser);
// router.delete("/users/:id", userController.deleteUser);

export default router;
