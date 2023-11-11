export type Role = 'ADMIN' | 'USER';

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

export interface UserProfileUpdateData {
  username: string;
  email: string;
  languages: Language[];
}
