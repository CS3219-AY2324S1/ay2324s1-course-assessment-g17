// copied from frontend

export type Role = "ADMIN" | "USER";

export interface Language {
  id: number;
  language: string;
}
export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  languages: Language[];
}

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
