import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { adminDb } from '@/lib/firebaseAdmin';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// In-memory fallback for local dev when Firestore credentials are not configured
const localFallbackMap = new Map<string, { original_url: string; user_id: string; createdAt: string; clicks: number }>();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'anonymous';

    if (!rateLimit(req, { limit: 30, windowMs: 60 * 60 * 1000 }).success) {
      return NextResponse.json({ error: 'Too many shorten requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { url, customCode } = body;

    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    let originalUrl: string;
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return NextResponse.json({ error: 'Only http and https protocols are supported' }, { status: 400 });
      }
      originalUrl = parsedUrl.toString();
    } catch {
      return NextResponse.json({ error: 'Invalid destination URL format' }, { status: 400 });
    }

    let shortCode = customCode ? customCode.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') : '';
    if (shortCode) {
      if (shortCode.length < 3 || shortCode.length > 30) {
        return NextResponse.json({ error: 'Custom alias must be between 3 and 30 characters' }, { status: 400 });
      }
    } else {
      shortCode = nanoid(7);
    }

    const linkData = {
      original_url: originalUrl,
      short_code: shortCode,
      user_id: userId,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };

    if (adminDb) {
      const docRef = adminDb.collection('short_urls').doc(shortCode);
      const existing = await docRef.get();
      if (existing.exists) {
        if (customCode) {
          return NextResponse.json({ error: 'Custom alias is already in use. Please choose another.' }, { status: 409 });
        }
        shortCode = nanoid(8);
      }
      await adminDb.collection('short_urls').doc(shortCode).set(linkData);
    } else {
      // In-memory fallback
      if (customCode && localFallbackMap.has(shortCode)) {
        return NextResponse.json({ error: 'Custom alias is already in use' }, { status: 409 });
      }
      localFallbackMap.set(shortCode, linkData);
    }

    const origin = req.nextUrl.origin;
    const shortUrl = `${origin}/u/${shortCode}`;
    return NextResponse.json({ shortUrl, shortCode });
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
