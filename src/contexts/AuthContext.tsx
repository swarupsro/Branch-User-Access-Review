import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  name: string;
  branchId: string;
  branchName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, this would verify the session with your backend
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Set up session timeout (15 minutes)
  useEffect(() => {
    if (!user) return;

    const sessionTimeout = 15 * 60 * 1000; // 15 minutes
    const timeoutId = setTimeout(() => {
      logout();
      navigate('/login', { state: { sessionExpired: true } });
    }, sessionTimeout);

    return () => clearTimeout(timeoutId);
  }, [user, navigate]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call your AD authentication endpoint
      // For demo purposes, we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated successful login (in a real app, this would come from your AD auth endpoint)
      if (username === 'manager' && password === 'password') {
        const userData: User = {
          id: '12345',
          name: 'John Manager',
          branchId: 'BR001',
          branchName: 'Main Street Branch'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Log the authentication event (in a real app, this would be a server-side audit log)
        console.log(`[AUDIT] User ${userData.id} logged in at ${new Date().toISOString()}`);
        
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials or unauthorized access');
      }
    } catch (err) {
      setError((err as Error).message);
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      // Log the logout event (in a real app, this would be a server-side audit log)
      console.log(`[AUDIT] User ${user.id} logged out at ${new Date().toISOString()}`);
    }
    
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};