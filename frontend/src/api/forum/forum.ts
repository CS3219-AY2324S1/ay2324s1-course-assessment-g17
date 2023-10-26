import { type ForumData, type ForumPostData } from '../../types/forum/forum';
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

  public async addPost(post: ForumPostData): Promise<never> {
    return await forumServiceClient.post(this.getForumUrl(), post);
  }

  // editPost(postId: number, data: any) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/${postId}`, data);
  // }

  public async deletePost(postId: number): Promise<void> {
    await forumServiceClient.delete(`${this.getForumUrl()}/${postId}`);
  }

  // upvotePost(postId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/${postId}/upvote`);
  // }

  // downvotePost(postId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/${postId}/downvote`);
  // }

  // searchPost(searchTerm: any) {
  //   return forumServiceClient.get(`${this.getForumUrl()}/search`, { params: { q: searchTerm } });
  // }

  /* Comments */
  // viewComments(postId: number) {
  //   return forumServiceClient.get(`${this.getForumUrl()}/${postId}/comments`);
  // }

  // addComment(postId: number, data: any) {
  //   return forumServiceClient.post(`${this.getForumUrl()}/${postId}/comments`, data);
  // }

  // editComment(commentId: number, data: any) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/comments/${commentId}`, data);
  // }

  // deleteComment(commentId: number) {
  //   return forumServiceClient.delete(`${this.getForumUrl()}/comments/${commentId}`);
  // }

  // upvoteComment(commentId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/comments/${commentId}/upvote`);
  // }

  // downvoteComment(commentId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/comments/${commentId}/downvote`);
  // }
}
