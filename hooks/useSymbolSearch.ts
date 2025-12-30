import { useState, useEffect, useCallback } from 'react';

export interface SymbolResult {
  symbol: string;
  shortname: string;
  longname: string;
  exchange?: string;
  quoteType?: string;
}

export function useSymbolSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SymbolResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchSymbols = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search symbols');
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to search symbols');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSymbols(query);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [query, searchSymbols]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    searchSymbols,
  };
}

