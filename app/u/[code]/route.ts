import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  if (!code) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    if (!adminDb) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Fetch original URL from Firestore
    const docRef = adminDb.collection('short_urls').doc(code);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.redirect(new URL('/404', req.url));
    }

    const data = doc.data();
    if (!data || !data.original_url) {
      return NextResponse.redirect(new URL('/404', req.url));
    }

    const originalUrl = data.original_url;

    // Security: Validate protocol to prevent javascript: or data: injection
    try {
      const urlObj = new URL(originalUrl);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        console.warn(`Blocked potentially malicious redirect protocol: ${urlObj.protocol} from code: ${code}`);
        return NextResponse.redirect(new URL('/404', req.url));
      }
    } catch (e) {
      console.error(`Invalid original URL for code ${code}:`, originalUrl);
      return NextResponse.redirect(new URL('/404', req.url));
    }

    // Increment clicks
    void docRef.update({
      clicks: admin.firestore.FieldValue.increment(1)
    }).catch((err: unknown) => console.error('Error incrementing clicks:', err));

    return NextResponse.redirect(originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
