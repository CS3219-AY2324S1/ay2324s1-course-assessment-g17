export interface ForumData {
  id: number;
  title: string;
  description: string;
  username: string;
  createdAt: Date;
  upvotes: number;
}

export interface ForumPostData {
  title: string;
  description: string;
  username: string;
}
