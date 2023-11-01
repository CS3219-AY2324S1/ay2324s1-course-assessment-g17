import express from "express";
import forumController from "../controllers/forumControllers";

const router = express.Router();

router.get("/posts", forumController.viewPosts);
router.get("/posts/:postId", forumController.viewPost);
router.get("/posts/:postId/comments", forumController.viewComments);
router.post("/posts", forumController.addPost);
router.post("/posts/:postId/comments", forumController.addComment);
router.put("/posts/:postId", forumController.editPost);
router.put("/comments/:commentId", forumController.editComment);
router.delete("/posts/:postId", forumController.deletePost);
router.delete("/comments/:commentId", forumController.deleteComment);
router.put("/posts/:postId/upvote", forumController.upvotePost);
router.put("/posts/:postId/downvote", forumController.downvotePost);
router.put("/comments/:commentId/upvote", forumController.upvoteComment);
router.put("/comments/:commentId/downvote", forumController.downvoteComment);
router.get("/search", forumController.searchPost);

export default router;
