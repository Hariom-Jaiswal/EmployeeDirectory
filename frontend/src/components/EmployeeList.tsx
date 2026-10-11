import React from 'react';
import type { Employee, APIStatus } from '../types';
import { EmployeeCard } from './EmployeeCard';

interface EmployeeListProps {
  employees: Employee[];
  status: APIStatus;
  error?: string | null;
  searchQuery: string;
  isLoading?: boolean;
  onRetry: () => void;
  onClearSearch: () => void;
}

const SkeletonBadge: React.FC = () => (
  <div className="shimmer-effect bg-[#ffffff] border border-neutral-300/80 rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full min-h-[175px]">
    <div className="flex justify-center mb-1 shrink-0">
      <span className="font-mono text-[11px] tracking-widest text-neutral-300 font-bold select-none">
        ======
      </span>
    </div>

    <div className="grid grid-cols-[105px_1fr] sm:grid-cols-[115px_1fr] gap-3.5 items-center grow my-auto">
      <div className="flex flex-col items-center justify-center shrink-0">
        <div className="w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
          <div className="w-20 h-20 bg-neutral-200/80 rounded-full animate-pulse" />
        </div>
        <div className="mt-1 text-center">
          <div className="w-16 h-3 bg-neutral-200/90 rounded font-mono animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col justify-center min-w-0 space-y-1.5 py-1">
        <div className="w-24 h-3 bg-neutral-200/80 rounded animate-pulse" />
        <div className="pt-0.5">
          <div className="w-36 sm:w-44 h-6 bg-neutral-200/90 rounded animate-pulse" />
          <div className="w-full border-b border-dashed border-neutral-300/60 my-1.5" />
        </div>
        <div className="w-32 sm:w-40 h-3 bg-neutral-200/70 rounded animate-pulse" />
        <div className="w-24 h-3 bg-neutral-200/70 rounded animate-pulse pt-0.5" />
      </div>
    </div>
  </div>
);

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  status,
  searchQuery,
  isLoading = false,
  onRetry,
  onClearSearch,
}) => {
  // 1.Loading State: skeleton grid
  if (isLoading || status === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="employee-list-loading">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonBadge key={idx} />
        ))}
      </div>
    );
  }

  // 2. Idle State: No employee before searching
  if (status === 'idle') {
    return null;
  }

  // 3. Error State 
  if (status === 'error') {
    return (
      <div
        className="bg-white border border-neutral-300/80 rounded-3xl p-8 sm:p-10 text-center max-w-md mx-auto my-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
        id="employee-list-error"
      >
        <div className="w-11 h-11 border border-neutral-300 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-neutral-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-1.5">Unable to load results</h3>
        <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto leading-relaxed">
          We couldn't complete your search right now. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={onRetry}
          id="retry-button"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-medium rounded-full transition-colors shadow-2xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  // 4. Empty State
  if (status === 'empty' || employees.length === 0) {
    return (
      <div
        className="bg-white border border-neutral-300/80 rounded-3xl p-8 sm:p-10 text-center max-w-md mx-auto my-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
        id="employee-list-empty"
      >
        <div className="w-11 h-11 border border-neutral-300 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-neutral-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-1.5">No results found</h3>
        <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto leading-relaxed overflow-hidden">
          {searchQuery
            ? `We couldn't find anyone matching "${searchQuery}". Please check the spelling or try searching with a different term.`
            : 'No team members found.'}
        </p>
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="inline-flex items-center px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-full transition-colors cursor-pointer"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  // 5. Success State
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      id="employee-list-grid"
    >
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
};
