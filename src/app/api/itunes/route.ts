import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'search') {
      const term = searchParams.get('term');
      if (!term || !term.trim()) {
        return NextResponse.json({ results: [] });
      }

      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
        term.trim()
      )}&entity=album&limit=12`;

      const response = await fetch(itunesUrl, {
        headers: { 'User-Agent': 'Pressroom/1.0' },
        next: { revalidate: 3600 } // Cache searches for 1 hour
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `iTunes API returned status ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    if (action === 'lookup') {
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({ error: 'Missing album id parameter' }, { status: 400 });
      }

      const itunesUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(
        id
      )}&entity=song`;

      const response = await fetch(itunesUrl, {
        headers: { 'User-Agent': 'Pressroom/1.0' },
        next: { revalidate: 86400 } // Cache album lookups for 24 hours
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `iTunes API returned status ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: 'Invalid action. Expected "search" or "lookup".' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('iTunes API route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
