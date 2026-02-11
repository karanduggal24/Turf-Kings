import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

export type UserRole = 'user' | 'turf_owner' | 'admin';

export function useUserRole() {
  const { user } = useAuthStore();
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole('user');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setRole(data.role);
      }
      setLoading(false);
    }

    fetchRole();
  }, [user]);

  return {
    role,
    loading,
    isUser: role === 'user',
    isTurfOwner: role === 'turf_owner',
    isAdmin: role === 'admin',
  };
}
