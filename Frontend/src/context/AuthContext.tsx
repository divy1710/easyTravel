import { createContext, useContext, useEffect, useMemo, useState, useRef, ReactNode } from 'react';
import { clearStoredUser, getStoredUser, setStoredUser, StoredUser } from '../utils/authStorage';
import { getCurrentUser, logout as apiLogout } from '../api/auth';

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  guest?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authCheckRef = useRef(false); // Prevent duplicate auth checks

  // Check authentication status on mount
  const checkAuth = async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckRef.current) return;
    authCheckRef.current = true;
    
    try {
      const data = await getCurrentUser();
      if (data.user) {
        setUser(data.user);
        setStoredUser(data.user);
      }
    } catch (error) {
      // Not authenticated or error - clear user
      setUser(null);
      clearStoredUser();
    } finally {
      setLoading(false);
      authCheckRef.current = false;
    }
  };

  useEffect(() => {
    // Try to restore user from localStorage first for immediate UI
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser as User);
    }
    // Then verify with server
    checkAuth();
  }, []);

  const login = (user: User) => {
    setUser(user);
    setStoredUser(user);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearStoredUser();
    }
  };

  const value = useMemo(() => ({ user, loading, login, logout, checkAuth }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
