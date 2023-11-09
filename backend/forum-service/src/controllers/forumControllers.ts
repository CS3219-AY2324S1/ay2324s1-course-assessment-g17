import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";

const forumController = {
  async viewPosts(req: Request, res: Response) {
    const posts = await prisma.post.findMany();
    res.json(posts);
  },

  async viewPost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
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

  async getComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(commentId) },
      });
      res.json(comment);
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
      // only update post if user is the author
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
      });
      if (post?.username !== username) {
        return res
          .status(400)
          .json({ error: "User is not the author of the post" });
      } else {
        const post = await prisma.post.update({
          where: { id: parseInt(postId) },
          data: { title, description, username },
        });
        res.json(post);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async editComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const { username, content } = req.body;
      // only update comment if user is the author
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(commentId) },
      });
      if (comment?.username !== username) {
        return res
          .status(400)
          .json({ error: "User is not the author of the comment" });
      } else {
        const comment = await prisma.comment.update({
          where: { id: parseInt(commentId) },
          data: { content },
        });
        res.json(comment);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async deletePost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const username = req.body.username;
      // only delete post if user is the author
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
      });
      if (post?.username !== username) {
        return res
          .status(400)
          .json({ error: "User is not the author of the post" });
      } else {
        await prisma.post.delete({
          where: { id: parseInt(postId) },
        });
        res.json({ message: "Post deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async deleteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const username = req.body.username;
      // only delete comment if user is the author
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(commentId) },
      });
      if (comment?.username !== username) {
        return res
          .status(400)
          .json({ error: "User is not the author of the comment" });
      } else {
        await prisma.comment.delete({
          where: { id: parseInt(commentId) },
        });
        res.json({ message: "Comment deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async upvotePost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const username = req.body.username;
      // only allow upvote if user has not upvoted before
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
      });
      if (post?.upvotes.includes(username)) {
        return res.status(400).json({ error: "User has upvoted before" });
      } else {
        const post = await prisma.post.update({
          where: { id: parseInt(postId) },
          data: { upvotes: { push: username } },
        });
        res.json(post);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async downvotePost(req: Request, res: Response) {
    const postId = req.params.postId;
    const username = req.body.username;
    // only allow downvote if user has upvoted before
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });
    if (!post?.upvotes.includes(username)) {
      return res.status(400).json({ error: "User has not upvoted before" });
    } else {
      const upvotes = post.upvotes.filter((upvote) => upvote !== username);
      const updatedPost = await prisma.post.update({
        where: { id: parseInt(postId) },
        data: { upvotes },
      });
      res.json(updatedPost);
    }
  },
  async upvoteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const username = req.body.username;
      // only allow upvote if user has not upvoted before
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(commentId) },
      });
      if (comment?.upvotes.includes(username)) {
        return res.status(400).json({ error: "User has upvoted before" });
      } else {
        const comment = await prisma.comment.update({
          where: { id: parseInt(commentId) },
          data: { upvotes: { push: username } },
        });
        res.json(comment);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async downvoteComment(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const username = req.body.username;
    // only allow downvote if user has upvoted before
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment?.upvotes.includes(username)) {
      return res.status(400).json({ error: "User has not upvoted before" });
    } else {
      const updatedComment = await prisma.comment.update({
        where: { id: parseInt(commentId) },
        data: {
          upvotes: {
            set: comment.upvotes.filter((upvote) => upvote !== username),
          },
        },
      });
      res.json(updatedComment);
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
