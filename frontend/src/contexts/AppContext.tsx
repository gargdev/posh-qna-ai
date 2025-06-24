// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// interface User {
//   googleId: string;
//   displayName: string;
//   email: string;
// }

// interface AppContextType {
//   user: User | null;
//   loading: boolean;
//   refreshUser: () => Promise<void>;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/api/auth/user', {
//         withCredentials: true,
//       });
//       setUser(response.data.user);
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <AppContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within an AppProvider');
//   }
//   return context;
// };


// src/contexts/AppContext.tsx
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from 'react';
// import axios from 'axios';

// export interface User {
//   displayName: string;
//   email:       string;
//   isSubscribed: boolean;
//   chatCredits:  number;
// }

// interface AppContextType {
//   user:        User | null;
//   loading:     boolean;
//   refreshUser: () => Promise<void>;
//   loginLocal:  (email: string, password: string) => Promise<User>;
//   loginGoogle: () => void;
//   logout:      () => Promise<void>;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user,    setUser]    = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const refreshUser = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get<User | null>(
//         `${import.meta.env.VITE_API_URL}/auth/user`
//       );
//       setUser(data.user);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Local login (email/password)
//   const loginLocal = async (email: string, password: string) => {
//     const { data } = await axios.post<{ user: User }>(
//       `${import.meta.env.VITE_API_URL}/auth/login`,
//       { email, password }
//     );
//     setUser(data.user);
//     return data.user;
//   };

//   // Google login—just redirect browser
//   const loginGoogle = () => {
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?redirect=${encodeURIComponent(window.location.origin)}`;
//   };

//   const logout = async () => {
//     await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`);
//     setUser(null);
//   };

//   useEffect(() => {
//     refreshUser();
//   }, []);

//   return (
//     <AppContext.Provider value={{ user, loading, refreshUser, loginLocal, loginGoogle, logout }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error('useApp must be inside AppProvider');
//   return ctx;
// };


// src/contexts/AppContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

export interface User {
  displayName:   string;
  email:         string;
  isSubscribed:  boolean;
  chatCredits:   number;
}

interface AppContextType {
  user:        User | null;
  loading:     boolean;
  refreshUser: () => Promise<void>;
  loginLocal:  (email: string, password: string) => Promise<User>;
  loginGoogle: () => void;
  logout:      () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ user: User | null }>(
        `${import.meta.env.VITE_API_URL}/auth/user`
      );
      setUser(response.data.user);
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginLocal = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );
      setUser(response.data.user);
      return response.data.user;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Login failed');
    }
  };

  const loginGoogle = () => {
    window.location.href =
      `${import.meta.env.VITE_API_URL}/auth/google?redirect=${encodeURIComponent(
        window.location.origin
      )}`;
  };

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`);
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, loading, refreshUser, loginLocal, loginGoogle, logout }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
