import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    // Instantiate YahooFinance
    const yahooFinance = new YahooFinance();

    // Search for symbols using Yahoo Finance
    const searchResults = await yahooFinance.search(query, {
      newsCount: 0,
      quotesCount: 10,
    });

    // Handle different response structures
    const quotes = Array.isArray(searchResults) 
      ? searchResults 
      : (searchResults.quotes || []);

    const results = quotes.map((quote: any) => ({
      symbol: quote.symbol,
      shortname: quote.shortname || quote.longname || quote.symbol,
      longname: quote.longname || quote.shortname || quote.symbol,
      exchange: quote.exchange,
      quoteType: quote.quoteType,
    }));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search symbols', message: error.message },
      { status: 500 }
    );
  }
}

