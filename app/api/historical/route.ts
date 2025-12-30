import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { TimeScale } from '@/utils/chart/types';

// Map our time scale to Yahoo Finance interval
const INTERVAL_MAP: Record<TimeScale, string> = {
  '1m': '1m',
  '3m': '3m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '2h': '2h',
  '4h': '4h',
  '1d': '1d',
  '3d': '1d', // Yahoo doesn't support 3d, use 1d
  '1w': '1wk',
  '1M': '1mo',
  '3M': '3mo',
};

// Calculate period based on time scale
function getPeriod(timeScale: TimeScale): string {
  const periodMap: Record<TimeScale, string> = {
    '1m': '1d',
    '3m': '1d',
    '5m': '1d',
    '15m': '5d',
    '30m': '1mo',
    '1h': '3mo',
    '2h': '6mo',
    '4h': '1y',
    '1d': '2y',
    '3d': '2y',
    '1w': '5y',
    '1M': '10y',
    '3M': '10y',
  };
  return periodMap[timeScale] || '1y';
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const timeScale = searchParams.get('timeScale') as TimeScale;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    if (!timeScale || !INTERVAL_MAP[timeScale]) {
      return NextResponse.json(
        { error: 'Invalid time scale' },
        { status: 400 }
      );
    }

    const interval = INTERVAL_MAP[timeScale];
    const period = getPeriod(timeScale);

    // Calculate period dates
    const endDate = new Date();
    const startDate = new Date();
    
    // Set start date based on period
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '5d':
        startDate.setDate(startDate.getDate() - 5);
        break;
      case '1mo':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3mo':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6mo':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case '2y':
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
      case '10y':
        startDate.setFullYear(startDate.getFullYear() - 10);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Instantiate YahooFinance
    const yahooFinance = new YahooFinance();

    // Use chart module instead of historical - it supports intraday intervals
    // Chart module accepts Date objects or date strings
    const chartResult = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: interval as any,
    });

    if (!chartResult || !chartResult.quotes || chartResult.quotes.length === 0) {
      return NextResponse.json(
        { error: 'No data found for symbol' },
        { status: 404 }
      );
    }

    // Transform data to our format
    // Chart module returns quotes array with date, open, high, low, close, volume
    const data = chartResult.quotes
      .filter((item: any) => item.open != null && item.high != null && item.low != null && item.close != null)
      .map((item: any) => {
        // Convert date to Unix timestamp
        const time = Math.floor(new Date(item.date).getTime() / 1000);
        return {
          time,
          open: Number(item.open.toFixed(2)),
          high: Number(item.high.toFixed(2)),
          low: Number(item.low.toFixed(2)),
          close: Number(item.close.toFixed(2)),
          volume: item.volume || 0,
        };
      })
      .sort((a: any, b: any) => a.time - b.time); // Sort by time ascending

    return NextResponse.json({ data, symbol }, { status: 200 });
  } catch (error: any) {
    console.error('Historical data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data', message: error.message },
      { status: 500 }
    );
  }
}

