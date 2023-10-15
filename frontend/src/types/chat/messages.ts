import type { User } from '../users/users';

export interface Message {
  user: User | null;
  text: string;
  time: Date;
}