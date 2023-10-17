import type { User } from '../users/users';

export interface Message {
  user: User | null;
  text: string;
  time: Date;
}

export interface FileMetadata {
  user: User | null;
  filename: string;
  buffer_size: number;
  time: Date;
}

export interface File {
  metadata: FileMetadata;
  buffer: Uint8Array | null;
}