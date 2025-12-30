'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AreaSeries,
  BarSeries,
  BaselineSeries,
  CandlestickSeries,
  createChart,
  HistogramSeries,
  LineSeries,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SymbolSearch } from '@/components/ui/symbol-search';
import { ChartType, TimeScale, CandlestickData, ValueData } from '@/utils/chart/types';
import { generateCandlestickData, generateValueData, generateHistogramData, generateBarData } from '@/utils/chart/dataGenerators';
import { getTimeScaleConfig } from '@/utils/chart/timeScaleConfig';
import { CHART_TYPE_LABELS, TIME_SCALE_LABELS, CHART_THEME, SERIES_COLORS } from '@/utils/chart/chartConfig';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { SymbolResult } from '@/hooks/useSymbolSearch';

// Default symbol: AAPL
const DEFAULT_SYMBOL: SymbolResult = {
  symbol: 'AAPL',
  shortname: 'Apple Inc.',
  longname: 'Apple Inc.',
  exchange: 'NMS',
  quoteType: 'EQUITY',
};

export default function TVChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area' | 'Bar' | 'Baseline' | 'Candlestick' | 'Histogram' | 'Line'> | null>(null);
  
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [timeScale, setTimeScale] = useState<TimeScale>('5m');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolResult | null>(DEFAULT_SYMBOL);
  
  const { data: historicalData, loading: dataLoading, error: dataError } = useHistoricalData(
    selectedSymbol?.symbol || null,
    timeScale
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: CHART_THEME.layout,
      grid: CHART_THEME.grid,
      crosshair: CHART_THEME.crosshair,
      rightPriceScale: CHART_THEME.rightPriceScale,
      timeScale: CHART_THEME.timeScale,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      localization: {
        timeFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        },
      },
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;

    chart.timeScale().applyOptions({
      ...getTimeScaleConfig(timeScale),
      ...CHART_THEME.timeScale,
    });

    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    // Use real data if available, otherwise use generated data
    // If no symbol selected, use empty data (clear state)
    const hasRealData = selectedSymbol && historicalData.length > 0;
    let data: CandlestickData[] | ValueData[] = [];

    if (!selectedSymbol) {
      // Clear state: empty data
      data = [];
    } else if (hasRealData) {
      // Use real historical data
      data = historicalData;
    } else {
      // Use generated data as fallback ONLY if a symbol is selected but no data is available yet
      // (or keep it as is for loading state if desired, but user asked for "by default show APPL... clear state no dummy")
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

    let series: ISeriesApi<'Area' | 'Bar' | 'Baseline' | 'Candlestick' | 'Histogram' | 'Line'> | null = null;

    // If data is empty we might still add the series but with empty data, or not add it.
    // Usually better to add it with empty data so the chart structure remains.
    
    switch (chartType) {
      case 'area':
        series = chart.addSeries(AreaSeries, {
          lineColor: SERIES_COLORS.line,
          topColor: SERIES_COLORS.line,
          bottomColor: 'rgba(16, 185, 129, 0.1)',
          lineWidth: 2,
        }) as ISeriesApi<'Area'>;
        if (hasRealData) {
          // Convert candlestick to value data for area chart
          const valueData: ValueData[] = (data as CandlestickData[]).map((d) => ({
            time: d.time,
            value: d.close,
          }));
          (series as ISeriesApi<'Area'>).setData(valueData);
        } else {
          // If data is empty array, it will work fine here
          (series as ISeriesApi<'Area'>).setData(data as ValueData[]);
        }
        break;

      case 'bar':
        series = chart.addSeries(BarSeries, {
          upColor: SERIES_COLORS.up,
          downColor: SERIES_COLORS.down,
          thinBars: false,
        }) as ISeriesApi<'Bar'>;
        (series as ISeriesApi<'Bar'>).setData(data as CandlestickData[]);
        break;

      case 'baseline':
        const baseValue = hasRealData && (data as CandlestickData[]).length > 0
          ? (data as CandlestickData[])[0].close
          : 50;
        series = chart.addSeries(BaselineSeries, {
          baseValue: { type: 'price', price: baseValue },
          topLineColor: SERIES_COLORS.up,
          topFillColor1: 'rgba(16, 185, 129, 0.2)',
          topFillColor2: 'rgba(16, 185, 129, 0.05)',
          bottomLineColor: SERIES_COLORS.down,
          bottomFillColor1: 'rgba(239, 68, 68, 0.05)',
          bottomFillColor2: 'rgba(239, 68, 68, 0.2)',
          lineWidth: 2,
        }) as ISeriesApi<'Baseline'>;
        if (hasRealData) {
          const valueData: ValueData[] = (data as CandlestickData[]).map((d) => ({
            time: d.time,
            value: d.close,
          }));
          (series as ISeriesApi<'Baseline'>).setData(valueData);
        } else {
          (series as ISeriesApi<'Baseline'>).setData(data as ValueData[]);
        }
        break;

      case 'candlestick':
        series = chart.addSeries(CandlestickSeries, {
          upColor: SERIES_COLORS.up,
          downColor: SERIES_COLORS.down,
          borderVisible: false,
          wickUpColor: SERIES_COLORS.up,
          wickDownColor: SERIES_COLORS.down,
        }) as ISeriesApi<'Candlestick'>;
        (series as ISeriesApi<'Candlestick'>).setData(data as CandlestickData[]);
        break;

      case 'histogram':
        series = chart.addSeries(HistogramSeries, {
          color: SERIES_COLORS.line,
          base: 0,
        }) as ISeriesApi<'Histogram'>;
        if (hasRealData) {
          // Calculate volume-based histogram or price change
          const histogramData: ValueData[] = (data as CandlestickData[]).map((d, i) => {
            if (i === 0) {
              return { time: d.time, value: 0, color: SERIES_COLORS.line };
            }
            const prev = (data as CandlestickData[])[i - 1];
            const change = d.close - prev.close;
            return {
              time: d.time,
              value: Math.abs(change),
              color: change >= 0 ? SERIES_COLORS.up : SERIES_COLORS.down,
            };
          });
          (series as ISeriesApi<'Histogram'>).setData(histogramData);
        } else {
          (series as ISeriesApi<'Histogram'>).setData(data as ValueData[]);
        }
        break;

      case 'line':
        series = chart.addSeries(LineSeries, {
          color: SERIES_COLORS.line,
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
        }) as ISeriesApi<'Line'>;
        if (hasRealData) {
          const valueData: ValueData[] = (data as CandlestickData[]).map((d) => ({
            time: d.time,
            value: d.close,
          }));
          (series as ISeriesApi<'Line'>).setData(valueData);
        } else {
          (series as ISeriesApi<'Line'>).setData(data as ValueData[]);
        }
        break;
    }

    seriesRef.current = series;
    chart.timeScale().fitContent();
  }, [chartType, timeScale, selectedSymbol, historicalData]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <div className="absolute top-6 left-6 z-20 flex gap-4">
        <SymbolSearch
          onSelect={setSelectedSymbol}
          selectedSymbol={selectedSymbol}
        />
        
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Chart Type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] justify-between bg-[#1A1A1A] text-gray-200 border-[#2A2A2A] hover:bg-[#252525] hover:border-[#3A3A3A]"
              >
                {CHART_TYPE_LABELS[chartType]}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[160px] bg-[#1A1A1A] border-[#2A2A2A]">
              <DropdownMenuRadioGroup
                value={chartType}
                onValueChange={(value) => setChartType(value as ChartType)}
              >
                <DropdownMenuRadioItem value="candlestick" className="text-gray-200 focus:bg-[#252525]">
                  Candlestick
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="area" className="text-gray-200 focus:bg-[#252525]">
                  Area
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bar" className="text-gray-200 focus:bg-[#252525]">
                  Bar
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="baseline" className="text-gray-200 focus:bg-[#252525]">
                  Baseline
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="histogram" className="text-gray-200 focus:bg-[#252525]">
                  Histogram
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="line" className="text-gray-200 focus:bg-[#252525]">
                  Line
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Time Scale
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[70px] justify-between bg-[#1A1A1A] text-gray-200 border-[#2A2A2A] hover:bg-[#252525] hover:border-[#3A3A3A]"
              >
                {TIME_SCALE_LABELS[timeScale]}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[70px] bg-[#1A1A1A] border-[#2A2A2A]">
              <DropdownMenuRadioGroup
                value={timeScale}
                onValueChange={(value) => setTimeScale(value as TimeScale)}
              >
                <DropdownMenuRadioItem value="1m" className="text-gray-200 focus:bg-[#252525]">
                  1m
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="5m" className="text-gray-200 focus:bg-[#252525]">
                  5m
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="15m" className="text-gray-200 focus:bg-[#252525]">
                  15m
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="30m" className="text-gray-200 focus:bg-[#252525]">
                  30m
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1h" className="text-gray-200 focus:bg-[#252525]">
                  1h
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="1d" className="text-gray-200 focus:bg-[#252525]">
                  1d
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3d" className="text-gray-200 focus:bg-[#252525]">
                  3d
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1w" className="text-gray-200 focus:bg-[#252525]">
                  1w
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1M" className="text-gray-200 focus:bg-[#252525]">
                  1M
                </DropdownMenuRadioItem>

              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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

      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
