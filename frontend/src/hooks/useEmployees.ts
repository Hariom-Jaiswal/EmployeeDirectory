import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { fetchEmployees, ApiError } from '../api';
import { DEBOUNCE_MS } from '../config/env';
import type { Employee, APIStatus, SearchMode } from '../types';

interface UseEmployeesOptions {
  initialLimit?: number;
  debounceMs?: number;
}

export function useEmployees({ initialLimit = 8, debounceMs = DEBOUNCE_MS }: UseEmployeesOptions = {}) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchMode, setSearchMode] = useState<SearchMode>('both');
  const debouncedSearch = useDebounce(searchTerm, debounceMs);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(initialLimit);

  const [status, setStatus] = useState<APIStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  // reset page back to 1 on new search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleModeChange = useCallback((mode: SearchMode) => {
    setSearchMode(mode);
    setPage(1);
  }, []);

  const executeFetch = useCallback(
    async (query: string, mode: SearchMode, currentPage: number, pageLimit: number) => {
      // on new trigger old cancel
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus('loading');
      setError(null);

      const offset = (currentPage - 1) * pageLimit;

      try {
        const response = await fetchEmployees(
          {
            search: query.trim() || undefined,
            mode,
            limit: pageLimit,
            offset,
          },
          controller.signal
        );

        setEmployees(response.items);
        setTotal(response.total);

        if (response.items.length === 0) {
          setStatus('empty');
        } else {
          setStatus('success');
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const message = err instanceof ApiError ? err.message : 'An unexpected error occurred.';
        setError(message);
        setStatus('error');
      }
    },
    []
  );

  useEffect(() => {
    const trimmed = debouncedSearch.trim();

    if (!trimmed) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setEmployees([]);
      setTotal(0);
      setStatus('idle');
      setError(null);
      return;
    }

    executeFetch(trimmed, searchMode, page, limit);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch, searchMode, page, limit, executeFetch]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isDebouncing = searchTerm !== debouncedSearch;

  const retry = useCallback(() => {
    executeFetch(debouncedSearch.trim(), searchMode, page, limit);
  }, [debouncedSearch, searchMode, page, limit, executeFetch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setPage(1);
  }, []);

  return {
    searchTerm,
    debouncedSearch,
    searchMode,
    employees,
    total,
    page,
    limit,
    totalPages,
    status,
    error,
    isDebouncing,
    setSearchTerm: handleSearchChange,
    setSearchMode: handleModeChange,
    setPage,
    setLimit,
    clearSearch,
    retry,
  };
}
