import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

// Mock SecureStore for web
let SecureStore: any = {};

if (Platform.OS !== 'web') {
  try {
    SecureStore = require('expo-secure-store');
  } catch (e) {
    console.warn('expo-secure-store not available');
  }
}

const WebStore = {
  setItemAsync: async (key: string, value: string) => localStorage.setItem(key, value),
  getItemAsync: async (key: string) => localStorage.getItem(key),
  deleteItemAsync: async (key: string) => localStorage.removeItem(key),
};

const Store = Platform.OS === 'web' ? WebStore : SecureStore;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  territoryId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await Store.getItemAsync('token');
      const userData = await Store.getItemAsync('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Mock login logic
    const mockUser: User = {
      id: '1',
      email,
      name: 'Sarah Wilson',
      role: 'Territory Manager',
      territoryId: 'T-123'
    };

    try {
      await Store.setItemAsync('token', 'mock-jwt-token');
      await Store.setItemAsync('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await Store.deleteItemAsync('token');
      await Store.deleteItemAsync('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Mock token refresh - replace with actual API call
      const newToken = 'refreshed_mock_jwt_token_' + Date.now();
      await Store.setItemAsync('authToken', newToken);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}