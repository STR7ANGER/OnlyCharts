import { Time } from 'lightweight-charts';

export type ChartType = 'area' | 'bar' | 'baseline' | 'candlestick' | 'histogram' | 'line';
export type TimeScale = '1m' | '5m' | '15m' | '30m' | '1h' | '1d' | '3d' | '1w' | '1M';

export interface CandlestickData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ValueData {
  time: Time;
  value: number;
  color?: string;
}

