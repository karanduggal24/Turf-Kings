'use client';

interface BookingsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function BookingsPagination({
  page,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
}: BookingsPaginationProps) {
  return (
    <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex items-center justify-between">
      <p className="text-xs text-gray-500">
        Showing <span className="font-medium text-gray-300">{(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, total)}</span> of{' '}
        <span className="font-medium text-gray-300">{total}</span> bookings
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1 text-gray-500 hover:text-primary transition-all disabled:opacity-30"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-all ${
              page === pageNum
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-primary/10 text-gray-400 hover:text-primary'
            }`}
          >
            {pageNum}
          </button>
        ))}
        {totalPages > 5 && (
          <>
            <span className="text-gray-600 text-xs px-1">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded hover:bg-primary/10 text-gray-400 hover:text-primary text-xs flex items-center justify-center transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-1 text-gray-500 hover:text-primary transition-all disabled:opacity-30"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
