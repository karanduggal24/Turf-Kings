'use client';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'turf_owner' | 'admin';
  created_at: string;
}

interface UserTableRowProps {
  user: User;
  onChangeRole: (user: User) => void;
}

export default function UserTableRow({ user, onChangeRole }: UserTableRowProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  return (
    <tr className="hover:bg-primary/5 transition-colors group">
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
          onClick={() => onChangeRole(user)}
          className="px-4 py-2 text-xs font-bold bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-lg transition-all"
        >
          Change Role
        </button>
      </td>
    </tr>
  );
}
