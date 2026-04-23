import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { adminDb } from '@/lib/firebaseAdmin';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const shortCode = nanoid(7);
    const originalUrl = url.startsWith('http') ? url : `https://${url}`;

    if (!adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    await adminDb.collection('short_urls').doc(shortCode).set({
      original_url: originalUrl,
      short_code: shortCode,
      user_id: session?.user?.id || null,
      createdAt: new Date().toISOString(),
      clicks: 0
    });

    const origin = req.nextUrl.origin;
    const shortUrl = `${origin}/u/${shortCode}`;

    return NextResponse.json({ shortUrl, shortCode });
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
