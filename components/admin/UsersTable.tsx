'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import UserTableRow from './users/UserTableRow';
import UserTableFilters from './users/UserTableFilters';
import UserRoleModal from './users/UserRoleModal';

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

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearchQuery, roleFilter, refreshKey]);

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

  const handleChangeRoleClick = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
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
        <UserTableFilters
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          onSearchChange={onSearchChange}
          onRoleFilterChange={onRoleFilterChange}
        />

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
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onChangeRole={handleChangeRoleClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

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

      <UserRoleModal
        user={selectedUser}
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleChange={handleRoleChange}
        isUpdating={updatingRole}
      />
    </>
  );
}
