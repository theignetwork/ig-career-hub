'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface UserData {
  user_id: number;
  email: string;
  name: string;
  membership_level: string;
  exp?: number;
  iat?: number;
}

interface AuthContextType {
  user: UserData | null;
  wpUserId: number | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  wpUserId: null,
  loading: true,
  isAuthenticated: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [wpUserId, setWpUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadAuth = async () => {
      console.log('[Auth] Checking for context parameter...');
      const token = searchParams?.get('context');

      if (token) {
        try {
          console.log('[Auth] Token received, verifying with server...');

          // Store token for future API calls
          sessionStorage.setItem('auth_token', token);

          // Verify token with server (server has the secret, not client!)
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });

          if (!response.ok) {
            throw new Error('Token verification failed');
          }

          const { user: userData } = await response.json();
          setUser(userData as UserData);
          setWpUserId(userData.user_id);

          // Store WordPress user ID for getUserId() to access
          sessionStorage.setItem('wp_user_id', userData.user_id.toString());

          // Store full user data
          sessionStorage.setItem('user_data', JSON.stringify(userData));

          // Clean URL (remove token from address bar for security)
          window.history.replaceState({}, '', window.location.pathname);

          console.log('[Auth] ✅ SUCCESS - User authenticated as WordPress user:', userData.user_id);
          console.log('[Auth] User name:', userData.name);
          console.log('[Auth] Membership:', userData.membership_level);
        } catch (err) {
          console.error('[Auth] ❌ Failed to authenticate:', err);
          // Clear any stored data on failure
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('wp_user_id');
          sessionStorage.removeItem('user_data');
          setUser(null);
          setWpUserId(null);
        }
      } else {
        // Check if user data already in sessionStorage (from previous page load)
        const storedUserId = sessionStorage.getItem('wp_user_id');
        const storedUserData = sessionStorage.getItem('user_data');

        if (storedUserId && storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
            setWpUserId(parseInt(storedUserId));
            console.log('[Auth] Using stored WordPress user ID:', storedUserId);
          } catch (err) {
            console.error('[Auth] Failed to parse stored user data:', err);
            sessionStorage.removeItem('user_data');
          }
        } else {
          console.log('[Auth] No token or stored user ID found - using anonymous mode');
        }
      }

      setLoading(false);
    };

    loadAuth();
  }, [searchParams]);

  return (
    <AuthContext.Provider value={{
      user,
      wpUserId,
      loading,
      isAuthenticated: !!wpUserId
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
