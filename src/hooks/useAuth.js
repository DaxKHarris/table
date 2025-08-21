import { useState, useEffect } from 'react';
import localAuth from '../services/localAuthService.js';

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await localAuth();
        if (user) {
          setAuthed(true); // Fix: change back to true for persistence
        }
      } catch (error) {
        console.error('Session check failed:', error);
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
  };

  return {
    authed,
    loading,
    handleLoginSuccess,
    handleLogout
  };
}