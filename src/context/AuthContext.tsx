import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'maman' | 'professionnel' | 'admin';
  phone?: string;
  isValidated?: boolean;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('yaydoom_token');
    const storedUser = localStorage.getItem('yaydoom_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('yaydoom_token', accessToken);
    localStorage.setItem('yaydoom_user', JSON.stringify(userData));

    switch (userData.role) {
      case 'maman':
        navigate('/dashboard-maman');
        break;
      case 'professionnel':
        if (userData.isValidated) {
          navigate('/dashboard-pro');
        } else {
          alert('Votre compte est en attente de validation par un administrateur.');
          logout();
        }
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
    localStorage.removeItem('yaydoom_token');
    localStorage.removeItem('yaydoom_user');
    navigate('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('yaydoom_user', JSON.stringify(updatedUser));
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