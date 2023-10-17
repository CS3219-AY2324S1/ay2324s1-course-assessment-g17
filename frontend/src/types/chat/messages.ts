import type { User } from '../users/users';

export interface Message {
  user: User | null;
  text: string;
  time: Date;
}

export interface MyFileMetadata {
  user: User | null;
  filename: string;
  buffer_size: number;
  time: Date;
}

export interface MyFile {
  metadata: MyFileMetadata;
  buffer: Uint8Array | null;
}
