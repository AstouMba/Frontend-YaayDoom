/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../application/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'maman' | 'professionnel' | 'admin';
  phone?: string;
  isValidated?: boolean;
  specialite?: string;
  matricule?: string;
  centreDeSante?: string;
  documentUrl?: string | null;
  documents?: Array<Record<string, any>>;
  decisionStatus?: 'approved' | 'rejected' | null;
  decisionMotif?: string | null;
  decisionDate?: string | null;
  decisionBy?: string | null;
  statut?: 'actif' | 'inactif' | string;
  dateInscription?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (userData: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = 'yaydoom_token';
const USER_KEY = 'yaydoom_user';
const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;

const safeParseUser = (raw: string | null): User | null => {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => safeParseUser(storage?.getItem(USER_KEY) ?? null));
  const [token, setToken] = useState<string | null>(() => storage?.getItem(TOKEN_KEY) ?? null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const refreshUser = async () => {
      if (!token) return;

      try {
        const currentUser = await getCurrentUser();
        if (cancelled || !currentUser) return;

        setUser(currentUser);
        storage?.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        // On garde la session locale si le backend ne répond pas.
      }
    };

    refreshUser();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = (userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    storage?.setItem(TOKEN_KEY, accessToken);
    storage?.setItem(USER_KEY, JSON.stringify(userData));

    switch (userData.role) {
      case 'maman':
        navigate('/dashboard-maman');
        break;
      case 'professionnel':
        navigate('/dashboard-pro');
        break;
      case 'admin':
        navigate('/dashboard-admin');
        break;
      default:
        navigate('/');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage?.removeItem(TOKEN_KEY);
    storage?.removeItem(USER_KEY);
    navigate('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      storage?.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
