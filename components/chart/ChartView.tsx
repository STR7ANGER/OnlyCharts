'use client';

import { useEffect, useRef } from 'react';
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
import { ChartType, TimeScale, CandlestickData, ValueData } from '@/utils/chart/types';
import { CHART_THEME, SERIES_COLORS } from '@/utils/chart/chartConfig';
import { getTimeScaleConfig } from '@/utils/chart/timeScaleConfig';

interface ChartViewProps {
  data: CandlestickData[] | ValueData[];
  chartType: ChartType;
  timeScale: TimeScale;
  hasRealData: boolean;
}

export function ChartView({ data, chartType, timeScale, hasRealData }: ChartViewProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area' | 'Bar' | 'Baseline' | 'Candlestick' | 'Histogram' | 'Line'> | null>(null);

  // Initialize Chart
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

  // Update Chart Data and Series
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;

    chart.timeScale().applyOptions({
      ...getTimeScaleConfig(timeScale),
      ...CHART_THEME.timeScale,
    });

    // Remove existing series
    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    let series: ISeriesApi<'Area' | 'Bar' | 'Baseline' | 'Candlestick' | 'Histogram' | 'Line'> | null = null;

    // Create new series based on chart type
    switch (chartType) {
      case 'area':
        series = chart.addSeries(AreaSeries, {
          lineColor: SERIES_COLORS.line,
          topColor: SERIES_COLORS.line,
          bottomColor: 'rgba(16, 185, 129, 0.1)',
          lineWidth: 2,
        }) as ISeriesApi<'Area'>;
        
        let areaData: ValueData[];
        if (hasRealData && data.length > 0 && 'close' in data[0]) {
             areaData = (data as CandlestickData[]).map((d) => ({
                time: d.time,
                value: d.close,
            }));
        } else {
             areaData = data as ValueData[];
        }
        (series as ISeriesApi<'Area'>).setData(areaData);
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
        const baseValue = hasRealData && data.length > 0 && 'close' in data[0]
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

        let baselineData: ValueData[];
        if (hasRealData && data.length > 0 && 'close' in data[0]) {
             baselineData = (data as CandlestickData[]).map((d) => ({
                time: d.time,
                value: d.close,
            }));
        } else {
             baselineData = data as ValueData[];
        }
        (series as ISeriesApi<'Baseline'>).setData(baselineData);
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
        
        let histogramData: ValueData[];
        if (hasRealData && data.length > 0 && 'close' in data[0]) {
           histogramData = (data as CandlestickData[]).map((d, i) => {
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
        } else {
            histogramData = data as ValueData[];
        }
        (series as ISeriesApi<'Histogram'>).setData(histogramData);
        break;

      case 'line':
        series = chart.addSeries(LineSeries, {
          color: SERIES_COLORS.line,
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
        }) as ISeriesApi<'Line'>;

        let lineData: ValueData[];
        if (hasRealData && data.length > 0 && 'close' in data[0]) {
             lineData = (data as CandlestickData[]).map((d) => ({
                time: d.time,
                value: d.close,
            }));
        } else {
             lineData = data as ValueData[];
        }
        (series as ISeriesApi<'Line'>).setData(lineData);
        break;
    }

    seriesRef.current = series;
    chart.timeScale().fitContent();
  }, [data, chartType, timeScale, hasRealData]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
