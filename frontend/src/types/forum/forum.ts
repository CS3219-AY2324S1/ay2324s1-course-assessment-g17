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
