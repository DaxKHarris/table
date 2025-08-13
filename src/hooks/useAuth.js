import { useState, useEffect } from 'react';
import localAuth from '../services/localAuthService.js';

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    (async () => {
      try {
        const user = await localAuth(); // Check for existing session/cookie
        if (user) {
          setAuthed(false); // I changed this var so that login would not persist!
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // If session check fails, user remains unauthenticated
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLoginSuccess = () => {
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
    // You might want to call a logout service here to clear cookies/session
    // await logoutService();
  };

  return {
    authed,
    loading,
    handleLoginSuccess,
    handleLogout
  };
}