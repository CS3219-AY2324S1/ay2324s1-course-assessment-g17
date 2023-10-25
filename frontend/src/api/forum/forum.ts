import { type ForumPostData } from '../../types/forum/forum';
import { forumServiceClient } from '../base';

// I think adding this is wrong...
export default class ForumAPI {
  protected getForumUrl(): string {
    return '/forum';
  }

  public async viewPosts(): Promise<ForumPostData[]> {
    const response = await forumServiceClient.get(`${this.getForumUrl()}/posts`);
    const postList = response.data.data as ForumPostData[];
    return postList;
  }

  // viewComments(postId: number) {
  //   return forumServiceClient.get(`${this.getForumUrl()}/posts/${postId}/comments`);
  // }

  public async addPost(data: ForumPostData): Promise<any> {
    return await forumServiceClient.post(`/posts`, data);
  }

  // addComment(postId: number, data: any) {
  //   return forumServiceClient.post(`${this.getForumUrl()}/posts/${postId}/comments`, data);
  // }

  // editPost(postId: number, data: any) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/posts/${postId}`, data);
  // }

  // editComment(commentId: number, data: any) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/comments/${commentId}`, data);
  // }

  public async deletePost(postId: number): Promise<void> {
    await forumServiceClient.delete(`${this.getForumUrl()}/posts/${postId}`);
  }

  // deleteComment(commentId: number) {
  //   return forumServiceClient.delete(`${this.getForumUrl()}/comments/${commentId}`);
  // }

  // upvotePost(postId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/posts/${postId}/upvote`);
  // }

  // downvotePost(postId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/posts/${postId}/downvote`);
  // }

  // upvoteComment(commentId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/comments/${commentId}/upvote`);
  // }

  // downvoteComment(commentId: number) {
  //   return forumServiceClient.put(`${this.getForumUrl()}/comments/${commentId}/downvote`);
  // }

  // searchPost(searchTerm: any) {
  //   return forumServiceClient.get(`${this.getForumUrl()}/search`, { params: { q: searchTerm } });
  // }
}
