import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  isLoading = false,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-neutral-200/80 text-xs font-mono text-neutral-500">
      <div>
        Showing <span className="font-semibold text-neutral-900">{startItem}</span> to{' '}
        <span className="font-semibold text-neutral-900">{endItem}</span> of{' '}
        <span className="font-semibold text-neutral-900">{totalItems}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          id="pagination-prev-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-mono font-medium shadow-2xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        <span className="px-3 py-1 text-xs font-mono font-bold text-neutral-900 bg-[#e8e7e3] rounded-full">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          id="pagination-next-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-mono font-medium shadow-2xs"
        >
          Next
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
