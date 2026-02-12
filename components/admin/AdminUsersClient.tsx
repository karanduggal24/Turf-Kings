'use client';

import { useState } from 'react';
import UsersStats from './UsersStats';
import UsersTable from './UsersTable';

export default function AdminUsersClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      {/* Header */}
      <header className="p-6 lg:p-10 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary/80">Users</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-1">Manage and monitor your community of players and turf owners.</p>
          </div>
        </div>

        {/* Stats */}
        <UsersStats key={refreshKey} />
      </header>

      {/* Content */}
      <div className="p-6 lg:p-10 pt-6">
        <UsersTable 
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          onSearchChange={setSearchQuery}
          onRoleFilterChange={setRoleFilter}
          onRefresh={handleRefresh}
          refreshKey={refreshKey}
        />
      </div>
    </>
  );
}
