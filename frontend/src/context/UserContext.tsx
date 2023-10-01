import React, { createContext, useContext, type ReactNode, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  languages: string[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context == null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
