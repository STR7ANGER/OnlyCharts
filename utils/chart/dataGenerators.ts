import { Time } from 'lightweight-charts';
import { TimeScale, CandlestickData, ValueData } from './types';
import { TIME_INTERVALS, getMonthTime } from './timeUtils';

export const generateCandlestickData = (timeScale: TimeScale, count: number = 100): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const now = Math.floor(Date.now() / 1000);
  let price = 100;
  
  if (timeScale === '1M') {
    for (let i = count - 1; i >= 0; i--) {
      const time = getMonthTime(i) as Time;
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

  } else {
    const interval = TIME_INTERVALS[timeScale];
    for (let i = count - 1; i >= 0; i--) {
      const time = (now - (i * interval)) as Time;
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
  }
  
  return data;
};

export const generateValueData = (timeScale: TimeScale, count: number = 100): ValueData[] => {
  const data: ValueData[] = [];
  const now = Math.floor(Date.now() / 1000);
  let value = 50;
  
  if (timeScale === '1M') {
    for (let i = count - 1; i >= 0; i--) {
      const time = getMonthTime(i) as Time;
      const change = (Math.random() - 0.5) * 5;
      value = Math.max(0, value + change);
      
      data.push({
        time,
        value: Number(value.toFixed(2)),
      });
    }

  } else {
    const interval = TIME_INTERVALS[timeScale];
    for (let i = count - 1; i >= 0; i--) {
      const time = (now - (i * interval)) as Time;
      const change = (Math.random() - 0.5) * 5;
      value = Math.max(0, value + change);
      
      data.push({
        time,
        value: Number(value.toFixed(2)),
      });
    }
  }
  
  return data;
};

export const generateHistogramData = (timeScale: TimeScale, count: number = 100): ValueData[] => {
  const data: ValueData[] = [];
  const now = Math.floor(Date.now() / 1000);
  
  if (timeScale === '1M') {
    for (let i = count - 1; i >= 0; i--) {
      const time = getMonthTime(i) as Time;
      const value = (Math.random() - 0.5) * 100;
      const color = value >= 0 ? '#10B981' : '#EF4444';
      
      data.push({
        time,
        value: Number(Math.abs(value).toFixed(2)),
        color,
      });
    }

  } else {
    const interval = TIME_INTERVALS[timeScale];
    for (let i = count - 1; i >= 0; i--) {
      const time = (now - (i * interval)) as Time;
      const value = (Math.random() - 0.5) * 100;
      const color = value >= 0 ? '#10B981' : '#EF4444';
      
      data.push({
        time,
        value: Number(Math.abs(value).toFixed(2)),
        color,
      });
    }
  }
  
  return data;
};

export const generateBarData = (timeScale: TimeScale, count: number = 100): CandlestickData[] => {
  return generateCandlestickData(timeScale, count);
};

