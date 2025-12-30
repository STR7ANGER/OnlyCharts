import { Time } from 'lightweight-charts';
import { TimeScale } from './types';

export const TIME_INTERVALS: Record<TimeScale, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '1d': 86400,
  '3d': 259200,
  '1w': 604800,
  '1M': 2592000,
};

export const getMonthTime = (monthsBack: number): number => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsBack);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};



export const timeToDate = (time: Time): Date => {
  if (typeof time === 'string') {
    return new Date(time);
  }
  const numericTime = time as number;
  return new Date(numericTime * 1000);
};

