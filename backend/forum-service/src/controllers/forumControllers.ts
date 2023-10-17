import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";

const forumController = {
  async viewPosts(req: Request, res: Response) {
    const posts = await prisma.post.findMany();
    res.json(posts);
  },

  async viewComments(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const comments = await prisma.comment.findMany({
        where: { postId: parseInt(postId) },
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async addPost(req: Request, res: Response) {
    const { title, description, username } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        description,
        username,
      },
    });
    res.json(post);
  },
  async addComment(req: Request, res: Response) {
    try {
      const { content, postId, username } = req.body;
      const comment = await prisma.comment.create({
        data: {
          content,
          postId: parseInt(postId),
          username,
        },
      });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async editPost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const { title, description, username } = req.body;
      const post = await prisma.post.update({
        where: { id: parseInt(postId) },
        data: { title, description, username },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async editComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const { content } = req.body;
      const comment = await prisma.comment.update({
        where: { id: parseInt(commentId) },
        data: { content },
      });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async deletePost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      await prisma.post.delete({
        where: { id: parseInt(postId) },
      });
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async deleteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      await prisma.comment.delete({
        where: { id: parseInt(commentId) },
      });
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async upvotePost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const post = await prisma.post.update({
        where: { id: parseInt(postId) },
        data: { upvotes: { increment: 1 } },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async downvotePost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const post = await prisma.post.update({
        where: { id: parseInt(postId) },
        data: { upvotes: { decrement: 1 } },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async upvoteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const comment = await prisma.comment.update({
        where: { id: parseInt(commentId) },
        data: { upvotes: { increment: 1 } },
      });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async downvoteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const comment = await prisma.post.update({
        where: { id: parseInt(commentId) },
        data: { upvotes: { decrement: 1 } },
      });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async searchPost(req: Request, res: Response) {
    try {
      const searchTerm = req.query.q as string;
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default forumController;
