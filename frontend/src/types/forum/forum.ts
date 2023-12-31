export interface ForumData {
  id: number;
  title: string;
  description: string;
  username: string;
  createdAt: Date;
  upvotes: string[];
}

export interface ForumPostData {
  title: string;
  description: string;
  username: string;
}

export interface Comment {
  id: number;
  content: string;
  post: ForumData;
  username: string;
  createdAt: Date;
  upvotes: string[];
}

export interface CommentData {
  content: string;
  postId: string;
  username: string;
}
