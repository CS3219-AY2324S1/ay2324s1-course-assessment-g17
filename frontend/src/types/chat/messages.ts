import type { User } from '../users/users';

export interface Message {
  user: User | null;
  text: string;
  time: Date;
}

export interface MyFile {
  user: User | null;
  dataURL: string;
  filename: string;
  time: Date;
}
