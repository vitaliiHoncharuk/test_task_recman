import { useState, useMemo } from 'react';
import { useDebounce } from '../core/useDebounce';

export interface UseSearchOptions {
  debounceMs?: number;
  caseSensitive?: boolean;
}

export function useSearch<T>(
  items: T[],
  searchFunction: (item: T, query: string) => boolean,
  options: UseSearchOptions = {}
) {
  const { debounceMs = 300, caseSensitive = false } = options;
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items;
    }

    const processedQuery = caseSensitive 
      ? debouncedQuery 
      : debouncedQuery.toLowerCase();

    return items.filter(item => searchFunction(item, processedQuery));
  }, [items, debouncedQuery, searchFunction, caseSensitive]);

  const clearSearch = () => setQuery('');

  return {
    query,
    setQuery,
    debouncedQuery,
    filteredItems,
    clearSearch,
    hasQuery: !!debouncedQuery.trim()
  };
}