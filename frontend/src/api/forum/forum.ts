import { type ForumData, type ForumPostData, type Comment, type CommentData } from '../../types/forum/forum';
import { forumServiceClient } from '../base';

export default class ForumAPI {
  protected getForumUrl(): string {
    return '/posts';
  }

  /* Posts */
  public async viewPosts(): Promise<ForumData[]> {
    const response = await forumServiceClient.get(this.getForumUrl());
    const postList = response.data as ForumData[];
    return postList;
  }

  public async viewPost(postId: number): Promise<ForumData> {
    const response = await forumServiceClient.get(`${this.getForumUrl()}/${postId}`);
    return response.data as ForumData;
  }

  public async addPost(post: ForumPostData): Promise<never> {
    return await forumServiceClient.post(this.getForumUrl(), post);
  }

  public async editPost(postId: number, updatedPostData: Partial<ForumPostData>): Promise<ForumData> {
    const response = await forumServiceClient.patch(`${this.getForumUrl()}/${postId}`, {
      ...updatedPostData,
    });

    return response.data as ForumData;
  }

  public async deletePost(postId: number, username: string): Promise<void> {
    await forumServiceClient.delete(`${this.getForumUrl()}/${postId}`, {
      data: { username },
    });
  }

  public async upvotePost(postId: number, username: string): Promise<ForumData> {
    const response = await forumServiceClient.put(`${this.getForumUrl()}/${postId}/upvote`, { username });
    return response.data as ForumData;
  }

  public async downvotePost(postId: number, username: string): Promise<ForumData> {
    const response = await forumServiceClient.put(`${this.getForumUrl()}/${postId}/downvote`, { username });
    return response.data as ForumData;
  }

  // // Currently not used as search is directly done on frontend.
  // public async searchPost(searchTerm: string): Promise<ForumData[]> {
  //   const response = await forumServiceClient.get('/search', {
  //     params: {
  //       q: searchTerm,
  //     },
  //   });
  //   return response.data;
  // }

  /* Comments */

  // Comments search is also directly done on frontend.

  public async viewComments(postId: number): Promise<Comment[]> {
    const response = await forumServiceClient.get(`${this.getForumUrl()}/${postId}/comments`);
    const commentList = response.data as Comment[];
    return commentList;
  }

  public async getComment(commentId: number): Promise<Comment> {
    const response = await forumServiceClient.get(`/comments/${commentId}`);
    const comment = response.data as Comment;
    return comment;
  }

  public async addComment(postId: number, data: CommentData): Promise<never> {
    return await forumServiceClient.post(`${this.getForumUrl()}/${postId}/comments`, data);
  }

  public async editComment(commentId: number, username: string, commentData: CommentData): Promise<never> {
    return await forumServiceClient.put(`/comments/${commentId}`, {
      username,
      content: commentData.content,
    });
  }

  public async deleteComment(commentId: number, username: string): Promise<void> {
    await forumServiceClient.delete(`/comments/${commentId}`, {
      data: { username },
    });
  }

  public async upvoteComment(commentId: number, username: string): Promise<Comment> {
    const response = await forumServiceClient.put(`/comments/${commentId}/upvote`, { username });
    return response.data as Comment;
  }

  public async downvoteComment(commentId: number, username: string): Promise<Comment> {
    const response = await forumServiceClient.put(`/comments/${commentId}/downvote`, { username });
    return response.data as Comment;
  }
}
