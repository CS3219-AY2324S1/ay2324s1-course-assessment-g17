import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/users", userController.getUsers);
router.get("/languages", userController.getLanguages);

// TODO
// router.get("/users/:id", userController.getUser);
// router.put("/users/:id", userController.updateUser);
// router.delete("/users/:id", userController.deleteUser);

export default router;
