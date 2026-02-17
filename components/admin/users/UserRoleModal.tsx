'use client';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'turf_owner' | 'admin';
  created_at: string;
}

interface UserRoleModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onRoleChange: (newRole: string) => void;
  isUpdating: boolean;
}

export default function UserRoleModal({
  user,
  isOpen,
  onClose,
  onRoleChange,
  isUpdating,
}: UserRoleModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => !isUpdating && onClose()}
    >
      <div
        className="bg-gray-900 border border-primary/20 rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Change User Role</h3>
        <p className="text-gray-400 mb-6">
          Update role for <span className="text-white font-semibold">{user.full_name}</span>
        </p>

        <div className="space-y-3 mb-6">
          {['user', 'turf_owner', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              disabled={isUpdating || user.role === role}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                user.role === role
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
                {user.role === role && (
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
