'use client';

import { useState, useMemo } from 'react';
import { ChartType, TimeScale, CandlestickData, ValueData } from '@/utils/chart/types';
import { generateCandlestickData, generateValueData, generateHistogramData } from '@/utils/chart/dataGenerators';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { SymbolResult } from '@/hooks/useSymbolSearch';
import { ChartHeader } from './ChartHeader';
import { ChartView } from './ChartView';

// Default symbol: AAPL
const DEFAULT_SYMBOL: SymbolResult = {
  symbol: 'AAPL',
  shortname: 'Apple Inc.',
  longname: 'Apple Inc.',
  exchange: 'NMS',
  quoteType: 'EQUITY',
};

export default function TVChart() {
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [timeScale, setTimeScale] = useState<TimeScale>('5m');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolResult | null>(DEFAULT_SYMBOL);
  
  const { data: historicalData, loading: dataLoading, error: dataError } = useHistoricalData(
    selectedSymbol?.symbol || null,
    timeScale
  );

  // Prepare data for the chart
  const { data, hasRealData } = useMemo(() => {
    let data: CandlestickData[] | ValueData[] = [];
    const hasRealData = !!(selectedSymbol && historicalData.length > 0);

    if (!selectedSymbol) {
      // Clear state: empty data
      data = [];
    } else if (hasRealData) {
      // Use real historical data
      data = historicalData;
    } else {
      // Use generated data as fallback ONLY if a symbol is selected but no data is available yet
      switch (chartType) {
        case 'area':
        case 'baseline':
        case 'line':
          data = generateValueData(timeScale);
          break;
        case 'bar':
        case 'candlestick':
          data = generateCandlestickData(timeScale);
          break;
        case 'histogram':
          data = generateHistogramData(timeScale);
          break;
        default:
          data = generateCandlestickData(timeScale);
      }
    }

    return { data, hasRealData };
  }, [selectedSymbol, historicalData, chartType, timeScale]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <ChartHeader
        selectedSymbol={selectedSymbol}
        onSymbolSelect={setSelectedSymbol}
        chartType={chartType}
        onChartTypeChange={setChartType}
        timeScale={timeScale}
        onTimeScaleChange={setTimeScale}
      />

      {dataLoading && selectedSymbol && (
        <div className="absolute top-6 right-6 z-20 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md px-4 py-2 text-gray-200 text-sm">
          Loading data for {selectedSymbol.symbol}...
        </div>
      )}

      {dataError && selectedSymbol && (
        <div className="absolute top-6 right-6 z-20 bg-red-900/20 border border-red-500/50 rounded-md px-4 py-2 text-red-200 text-sm">
          Error: {dataError}
        </div>
      )}

      <ChartView
        data={data}
        chartType={chartType}
        timeScale={timeScale}
        hasRealData={hasRealData}
      />
    </div>
  );
}
