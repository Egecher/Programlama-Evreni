"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Badge {
  name: string;
  icon: string;
  earnedAt: string | Date;
}

export interface UserData {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  points: number;
  level: string;
  avatar?: string;
  badges: Badge[];
}

interface AuthContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        console.error("Oturum kontrolü başarısız oldu.");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);