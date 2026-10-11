import React from 'react';
import type { SearchMode } from '../types';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  searchMode?: SearchMode;
  onModeChange?: (mode: SearchMode) => void;
  isDebouncing?: boolean;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  searchMode = 'both',
  onModeChange,
  isDebouncing = false,
  isLoading = false,
}) => {
  const placeholder =
    searchMode === 'name'
      ? 'Search by employee name (e.g. Rahul, Priya)...'
      : searchMode === 'department'
        ? 'Search by department (e.g. Engineering, Product)...'
        : 'Search by name or department (e.g. Rahul, Engineering)...';

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3">

      <div className="relative w-full group">

        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-800 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          id="employee-search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClear();
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3.5 bg-white border border-neutral-300/80 hover:border-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 shadow-[0_2px_12px_rgba(0,0,0,0.04)] outline-hidden transition-all duration-150"
        />

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
          {(isDebouncing || isLoading) && (
            <div
              className="flex items-center text-[11px] font-mono font-medium text-neutral-600 bg-neutral-100/90 px-2 py-0.5 rounded-full border border-neutral-200"
              title="Searching"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse mr-1.5" />
              <span>{isDebouncing ? 'Typing...' : 'Searching...'}</span>
            </div>
          )}

          {value.length === 0 && !isDebouncing && !isLoading && (
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-neutral-400 bg-neutral-100 border border-neutral-200/80 px-1.5 py-0.5 rounded-md select-none">
              ESC
            </span>
          )}

          {value.length > 0 && (
            <button
              type="button"
              id="clear-search-button"
              onClick={onClear}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Clear search (Esc)"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {onModeChange && (
        <div
          role="group"
          aria-label="Search scope filters"
          className="inline-flex items-center p-1 bg-neutral-200/50 border border-neutral-300/50 rounded-xl select-none gap-0.5 shadow-2xs"
        >
          <button
            type="button"
            id="search-mode-both"
            aria-pressed={searchMode === 'both'}
            onClick={() => onModeChange('both')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${searchMode === 'both'
              ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/40'
              }`}
          >
            Both
          </button>

          <button
            type="button"
            id="search-mode-name"
            aria-pressed={searchMode === 'name'}
            onClick={() => onModeChange('name')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${searchMode === 'name'
              ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/40'
              }`}
          >
            By Name
          </button>

          <button
            type="button"
            id="search-mode-dept"
            aria-pressed={searchMode === 'department'}
            onClick={() => onModeChange('department')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${searchMode === 'department'
              ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/40'
              }`}
          >
            By Department
          </button>
        </div>
      )}
    </div>
  );
};
