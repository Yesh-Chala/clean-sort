import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { authService, AuthUser } from '@/lib/auth-service';
import { initializeFCM, onForegroundMessage } from '@/lib/fcm-service';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const foregroundUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener...');
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser: User | null) => {
      console.log('AuthContext: Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      const authUser = authService.convertToAuthUser(firebaseUser);
      console.log('AuthContext: Converted user:', authUser);
      setUser(authUser);
      setLoading(false);
      console.log('AuthContext: Loading set to false, user state updated');

      // Clean up previous foreground listener if exists
      if (foregroundUnsubscribeRef.current) {
        foregroundUnsubscribeRef.current();
        foregroundUnsubscribeRef.current = null;
      }

      // Initialize FCM when user logs in
      if (authUser) {
        try {
          const token = await initializeFCM();
          if (token) {
            console.log('FCM token obtained, sending to backend...');
            try {
              await apiClient.registerFCMToken(token);
              console.log('FCM token registered successfully');
            } catch (error) {
              console.error('Error registering FCM token:', error);
            }
          }
        } catch (error) {
          console.error('Error initializing FCM:', error);
        }

        // Set up foreground message listener (for when app is open and notification arrives)
        foregroundUnsubscribeRef.current = onForegroundMessage((payload) => {
          // Handle notification when app is in foreground
          console.log('✅ Notification received (foreground):', payload);
          console.log('📊 Notification data:', {
            title: payload.notification?.title,
            body: payload.notification?.body,
            data: payload.data,
          });
          // The onForegroundMessage function now shows browser notifications automatically
        });
      }
    });

    return () => {
      unsubscribe();
      // Clean up foreground listener on unmount
      if (foregroundUnsubscribeRef.current) {
        foregroundUnsubscribeRef.current();
      }
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signUp(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signIn(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const getIdToken = async () => {
    return await authService.getIdToken();
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
