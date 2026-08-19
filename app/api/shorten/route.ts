import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { adminDb } from '@/lib/firebaseAdmin';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!rateLimit(req, { limit: 20, windowMs: 60 * 60 * 1000 }).success) {
      return NextResponse.json({ error: 'Too many shorten requests' }, { status: 429 });
    }

    const { url } = await req.json();
    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let originalUrl: string;
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Unsupported protocol');
      }
      originalUrl = parsedUrl.toString();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const shortCode = nanoid(7);
    await adminDb.collection('short_urls').doc(shortCode).create({
      original_url: originalUrl,
      short_code: shortCode,
      user_id: session.user.id,
      createdAt: new Date().toISOString(),
      clicks: 0,
    });

    const shortUrl = `${req.nextUrl.origin}/u/${shortCode}`;
    return NextResponse.json({ shortUrl, shortCode });
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
