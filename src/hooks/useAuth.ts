import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { subscribeToAuthChanges } from '../lib/firebase/auth';

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return { user, loading };
}