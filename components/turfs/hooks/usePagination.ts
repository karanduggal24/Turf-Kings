import { useMemo } from 'react';

export function usePagination<T>(items: T[], currentPage: number, itemsPerPage: number) {
  return useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      paginatedItems,
      totalPages,
      startIndex,
      endIndex
    };
  }, [items, currentPage, itemsPerPage]);
}
