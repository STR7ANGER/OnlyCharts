import { Time } from 'lightweight-charts';
import { TimeScale, CandlestickData, ValueData } from './types';
import { TIME_INTERVALS, getMonthTime } from './timeUtils';

const getTimeForIndex = (index: number, timeScale: TimeScale, now: number): Time => {
  if (timeScale === '1M') {
    return getMonthTime(index) as Time;
  }
  const interval = TIME_INTERVALS[timeScale];
  return (now - (index * interval)) as Time;
};

export const generateCandlestickData = (timeScale: TimeScale, count: number = 100): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const now = Math.floor(Date.now() / 1000);
  let price = 100;
  
  for (let i = count - 1; i >= 0; i--) {
    const time = getTimeForIndex(i, timeScale, now);
    const change = (Math.random() - 0.5) * 10;
    const open = price;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    price = close;
    
    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    });
  }
  
  return data;
};

export const generateValueData = (timeScale: TimeScale, count: number = 100): ValueData[] => {
  const data: ValueData[] = [];
  const now = Math.floor(Date.now() / 1000);
  let value = 50;
  
  for (let i = count - 1; i >= 0; i--) {
    const time = getTimeForIndex(i, timeScale, now);
    const change = (Math.random() - 0.5) * 5;
    value = Math.max(0, value + change);
    
    data.push({
      time,
      value: Number(value.toFixed(2)),
    });
  }
  
  return data;
};

export const generateHistogramData = (timeScale: TimeScale, count: number = 100): ValueData[] => {
  const data: ValueData[] = [];
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = count - 1; i >= 0; i--) {
    const time = getTimeForIndex(i, timeScale, now);
    const value = (Math.random() - 0.5) * 100;
    const color = value >= 0 ? '#10B981' : '#EF4444';
    
    data.push({
      time,
      value: Number(Math.abs(value).toFixed(2)),
      color,
    });
  }
  
  return data;
};

export const generateBarData = (timeScale: TimeScale, count: number = 100): CandlestickData[] => {
  return generateCandlestickData(timeScale, count);
};

