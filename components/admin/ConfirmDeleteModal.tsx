interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  venueName?: string;
  isDeleting?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Venue',
  message = 'Are you sure you want to permanently delete this venue? This action cannot be undone.',
  venueName,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-red-500/30 rounded-2xl max-w-md w-full shadow-2xl shadow-red-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wider">Warning</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {message}
          </p>
          
          {venueName && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                Venue to be deleted
              </p>
              <p className="text-white font-bold">{venueName}</p>
            </div>
          )}

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-yellow-500 text-sm mt-0.5">info</span>
            <p className="text-xs text-yellow-200">
              This will permanently remove all venue data, bookings, and reviews. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/5 border-t border-red-500/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <span className="animate-spin">⚡</span>
                Deleting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
