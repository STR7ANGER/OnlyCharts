import { Time } from 'lightweight-charts';
import { TimeScale } from './types';
import { timeToDate } from './timeUtils';

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const formatDate = (date: Date): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

const formatDateWithDay = (date: Date): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const dayName = dayNames[date.getDay()];
  return `${dayName} ${month} ${day}`;
};

export const getTimeScaleConfig = (scale: TimeScale) => {
  switch (scale) {
    case '1m':
      return {
        timeVisible: true,
        secondsVisible: true,
        tickMarkFormatter: (time: Time) => {
          const date = timeToDate(time);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const seconds = date.getSeconds();
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
      };
    case '5m':
      return {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => formatTime(timeToDate(time)),
      };
    case '15m':
    case '30m':
      return {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => formatTime(timeToDate(time)),
      };
    case '1h':
      return {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => {
          const date = timeToDate(time);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = monthNames[date.getMonth()];
          const day = date.getDate();
          const hours = date.getHours();
          return `${month} ${day} ${hours.toString().padStart(2, '0')}:00`;
        },
      };
    case '1d':
    case '3d':
      return {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => formatDate(timeToDate(time)),
      };
    case '1w':
      return {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => formatDateWithDay(timeToDate(time)),
      };
    case '1M':
      return {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => {
          const date = timeToDate(time);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear();
          return `${month} ${year}`;
        },
      };
    default:
      return {
        timeVisible: true,
        secondsVisible: false,
      };
  }
};

