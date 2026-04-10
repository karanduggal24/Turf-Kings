import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

export type UserRole = 'user' | 'turf_owner' | 'admin';

export function useUserRole() {
  const { user } = useAuthStore();
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole('user');
      setLoading(false);
      return;
    }

    // Fetch fresh from DB every time user changes — never rely on cached auth metadata
    async function fetchRole() {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user!.id)
        .single();

      setRole(((data as any)?.role ?? 'user') as UserRole);
      setLoading(false);
    }

    fetchRole();

    // Also subscribe to realtime changes on this user's row
    // so the navbar updates immediately when admin approves a venue
    const channel = supabase
      .channel(`user-role-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const newRole = (payload.new as any)?.role;
          if (newRole) setRole(newRole as UserRole);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    role,
    loading,
    isUser: role === 'user',
    isTurfOwner: role === 'turf_owner',
    isAdmin: role === 'admin',
  };
}
