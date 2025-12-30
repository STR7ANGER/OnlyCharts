import { ChartType, TimeScale } from './types';

export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  candlestick: 'Candlestick',
  area: 'Area',
  bar: 'Bar',
  baseline: 'Baseline',
  histogram: 'Histogram',
  line: 'Line',
};

export const TIME_SCALE_LABELS: Record<TimeScale, string> = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '1d': '1d',
  '3d': '3d',
  '1w': '1w',
  '1M': '1M',
};

export const CHART_THEME = {
  layout: {
    textColor: '#9CA3AF',
    background: { color: '#000000' },
    fontSize: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  grid: {
    vertLines: {
      color: '#1A1A1A',
      style: 1,
      visible: true,
    },
    horzLines: {
      color: '#1A1A1A',
      style: 1,
      visible: true,
    },
  },
  crosshair: {
    mode: 0,
    vertLine: {
      color: '#4B5563',
      width: 1,
      style: 3,
      labelBackgroundColor: '#1F1F1F',
    },
    horzLine: {
      color: '#4B5563',
      width: 1,
      style: 3,
      labelBackgroundColor: '#1F1F1F',
    },
  },
  rightPriceScale: {
    borderColor: '#1A1A1A',
    textColor: '#6B7280',
  },
  timeScale: {
    borderColor: '#1A1A1A',
    timeVisible: true,
    secondsVisible: false,
    rightOffset: 10,
    barSpacing: 6,
    fixLeftEdge: false,
    fixRightEdge: false,
    lockVisibleTimeRangeOnResize: false,
    rightBarStaysOnScroll: true,
    allowBoldLabels: false,
  },
};

export const SERIES_COLORS = {
  up: '#10B981',
  down: '#EF4444',
  line: '#10B981',
};

