'use client';

import Button from '@/components/common/Button';

interface VenueGridPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  displayCount: number;
  onPageChange: (page: number) => void;
}

export default function VenueGridPagination({
  page,
  totalPages,
  total,
  displayCount,
  onPageChange,
}: VenueGridPaginationProps) {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-6">
      <p className="text-sm text-gray-400">
        Showing <span className="font-bold text-white">{displayCount}</span> of{' '}
        <span className="font-bold text-white">{total}</span> venues
      </p>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          variant="ghost"
          size="sm"
          icon="chevron_left"
        >
          
        </Button>
        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-lg transition-all ${
              page === pageNum
                ? 'bg-primary text-black font-bold shadow-sm'
                : 'border border-primary/20 hover:bg-primary/10 text-white'
            }`}
          >
            {pageNum}
          </button>
        ))}
        <Button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          variant="ghost"
          size="sm"
          icon="chevron_right"
        >
          
        </Button>
      </div>
    </div>
  );
}
