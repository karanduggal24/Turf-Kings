'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'turf_owner' | 'admin';
  created_at: string;
}

interface UsersTableProps {
  searchQuery: string;
  roleFilter: string;
  onSearchChange: (query: string) => void;
  onRoleFilterChange: (role: string) => void;
  onRefresh: () => void;
  refreshKey: number;
}

export default function UsersTable({
  searchQuery,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onRefresh,
  refreshKey,
}: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Debounce search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearchQuery, roleFilter, refreshKey]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, roleFilter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearchQuery,
        role: roleFilter,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(newRole: string) {
    if (!selectedUser) return;

    try {
      setUpdatingRole(true);
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedUser.id,
          role: newRole,
        }),
      });

      if (response.ok) {
        // Update local state
        setUsers(users.map(u => 
          u.id === selectedUser.id ? { ...u, role: newRole as any } : u
        ));
        setShowRoleModal(false);
        setSelectedUser(null);
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setUpdatingRole(false);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'user':
        return (
          <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20 uppercase">
            Player
          </span>
        );
      case 'turf_owner':
        return (
          <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20 uppercase">
            Turf Owner
          </span>
        );
      case 'admin':
        return (
          <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20 uppercase">
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading && users.length === 0) {
    return (
      <div className="bg-white/5 border border-primary/10 rounded-xl p-12 flex items-center justify-center">
        <span className="animate-spin text-4xl">⚡</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/5 border border-primary/5 rounded-xl shadow-sm overflow-hidden">
        {/* Control Bar */}
        <div className="p-6 border-b border-primary/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-primary text-white placeholder:text-gray-500 outline-none"
              placeholder="Search by name, email or ID..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              className="bg-black border border-primary/20 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary text-white w-full md:w-auto"
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">Player</option>
              <option value="turf_owner">Turf Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 border-b border-primary/10">User Info</th>
                <th className="px-6 py-4 border-b border-primary/10">Role</th>
                <th className="px-6 py-4 border-b border-primary/10">Join Date</th>
                <th className="px-6 py-4 border-b border-primary/10">Account Status</th>
                <th className="px-6 py-4 border-b border-primary/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {getInitials(user.full_name)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.full_name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        ACTIVE
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="px-4 py-2 text-xs font-bold bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-lg transition-all"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="p-6 border-t border-primary/10 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing <span className="font-semibold text-white">{(page - 1) * 10 + 1} - {Math.min(page * 10, total)}</span> of{' '}
              <span className="font-semibold text-white">{total}</span> users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-primary/20 text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-black'
                        : 'border border-primary/20 text-gray-400 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-primary/20 text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !updatingRole && setShowRoleModal(false)}
        >
          <div
            className="bg-gray-900 border border-primary/20 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Change User Role</h3>
            <p className="text-gray-400 mb-6">
              Update role for <span className="text-white font-semibold">{selectedUser.full_name}</span>
            </p>

            <div className="space-y-3 mb-6">
              {['user', 'turf_owner', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  disabled={updatingRole || selectedUser.role === role}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedUser.role === role
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white capitalize">
                        {role === 'user' ? 'Player' : role === 'turf_owner' ? 'Turf Owner' : 'Admin'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {role === 'user' && 'Regular user who can book turfs'}
                        {role === 'turf_owner' && 'Can list and manage turfs'}
                        {role === 'admin' && 'Full access to admin panel'}
                      </p>
                    </div>
                    {selectedUser.role === role && (
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={updatingRole}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
