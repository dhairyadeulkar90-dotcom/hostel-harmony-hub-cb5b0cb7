import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/complaint';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find or create mock user based on role
    const mockUser = mockUsers.find(u => u.role === role) || {
      id: Date.now().toString(),
      name: role === 'student' ? 'Student User' : 'Warden User',
      email,
      role,
      roomNumber: role === 'student' ? '101' : undefined,
      hostelBlock: role === 'student' ? 'Block A' : undefined,
    };
    
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
