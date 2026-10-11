import React from 'react';
import { useEmployees } from './hooks/useEmployees';
import { SearchBar } from './components/SearchBar';
import { EmployeeList } from './components/EmployeeList';
import { Pagination } from './components/Pagination';

export const App: React.FC = () => {
  const {
    searchTerm,
    searchMode,
    employees,
    total,
    page,
    limit,
    totalPages,
    status,
    error,
    isDebouncing,
    setSearchTerm,
    setSearchMode,
    setPage,
    clearSearch,
    retry,
  } = useEmployees({ initialLimit: 9, debounceMs: 300 });

  const hasSearchQuery = searchTerm.trim().length > 0;
  const isTypingOrLoading = isDebouncing || status === 'loading';

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col font-sans selection:bg-neutral-900 selection:text-white">

      <main
        className={`grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col transition-all duration-200 ${hasSearchQuery ? 'py-8' : 'justify-center py-20 sm:py-32'
          }`}
      >
        <section
          className={`text-center mx-auto w-full transition-all duration-300 ${hasSearchQuery ? 'max-w-2xl mb-8' : 'max-w-2xl'
            }`}
        >
          <h1
            className={`font-bold tracking-tight text-neutral-900 select-none transition-all duration-200 ${hasSearchQuery
                ? 'text-2xl sm:text-3xl mb-4'
                : 'text-4xl sm:text-5xl md:text-6xl mb-6'
              }`}
          >
            Employee Directory
          </h1>

          <div className="w-full">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={clearSearch}
              searchMode={searchMode}
              onModeChange={setSearchMode}
              isDebouncing={isDebouncing}
              isLoading={status === 'loading'}
            />
          </div>
        </section>

        {hasSearchQuery && (
          <div className="animate-fadeIn w-full grow flex flex-col">
            <div className="flex items-center justify-between mb-5 px-3.5 py-2.5 rounded-xl bg-neutral-200/40 border border-neutral-300/40 text-xs font-mono text-neutral-600">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isTypingOrLoading ? 'bg-neutral-800 animate-ping' : 'bg-neutral-700'}`} />
                <span>
                  {isTypingOrLoading
                    ? 'Searching directory...'
                    : `${total} ${total === 1 ? 'member' : 'members'} found`}
                </span>
              </div>
              <div className="text-neutral-500">
                Filter: <span className="font-semibold text-neutral-800">{searchMode === 'both' ? 'Name & Department' : `By ${searchMode === 'department' ? 'Department' : 'Name'}`}</span>
              </div>
            </div>

            <div className="grow">
              <EmployeeList
                employees={employees}
                status={status}
                error={error}
                searchQuery={searchTerm}
                isLoading={isTypingOrLoading}
                onRetry={retry}
                onClearSearch={clearSearch}
              />
            </div>

            {!isTypingOrLoading && status !== 'error' && total > limit && (
              <div className="mt-8 pb-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={total}
                  limit={limit}
                  onPageChange={setPage}
                  isLoading={isTypingOrLoading}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
