'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useSymbolSearch, SymbolResult } from '@/hooks/useSymbolSearch';
import { cn } from '@/lib/utils';

interface SymbolSearchProps {
  onSelect: (symbol: SymbolResult | null) => void;
  selectedSymbol: SymbolResult | null;
  className?: string;
}

export function SymbolSearch({ onSelect, selectedSymbol, className }: SymbolSearchProps) {
  const { query, setQuery, results, loading } = useSymbolSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: SymbolResult) => {
    onSelect(symbol);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
          Symbol
        </label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={selectedSymbol ? selectedSymbol.symbol : 'Search symbol...'}
              className="w-[200px] h-9 pl-9 pr-8 bg-[#1A1A1A] text-gray-200 border border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A3A3A] focus:border-[#3A3A3A] placeholder:text-gray-500"
            />
            {selectedSymbol && !query && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                  setQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {loading && !selectedSymbol && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
            )}
          </div>

          {isOpen && (query.length > 0 || results.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
              {loading && results.length === 0 ? (
                <div className="px-4 py-3 text-gray-400 text-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              ) : results.length === 0 && query.length > 0 ? (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  No results found
                </div>
              ) : (
                results.map((result, index) => (
                  <button
                    key={`${result.symbol}-${index}`}
                    type="button"
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm transition-colors',
                      highlightedIndex === index
                        ? 'bg-[#252525] text-gray-100'
                        : 'text-gray-200 hover:bg-[#252525]'
                    )}
                  >
                    <div className="font-medium">{result.symbol}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {result.shortname}
                    </div>
                    {result.exchange && (
                      <div className="text-xs text-gray-500">{result.exchange}</div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

