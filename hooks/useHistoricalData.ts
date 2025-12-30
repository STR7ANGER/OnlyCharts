import { useState, useEffect } from 'react';
import { TimeScale, CandlestickData } from '@/utils/chart/types';

export function useHistoricalData(symbol: string | null, timeScale: TimeScale) {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setData([]);
      return;
    }

    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/historical?symbol=${encodeURIComponent(symbol)}&timeScale=${timeScale}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch historical data');
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch historical data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [symbol, timeScale]);

  return {
    data,
    loading,
    error,
  };
}

