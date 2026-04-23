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

    // Increment clicks
    void docRef.update({
      clicks: admin.firestore.FieldValue.increment(1)
    }).catch((err: unknown) => console.error('Error incrementing clicks:', err));

    return NextResponse.redirect(new URL(data.original_url));
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
