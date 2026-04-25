import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Rate limit feedback: 5 per 15 minutes per IP
    const { success, retryAfter } = rateLimit(req, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!success) {
      return NextResponse.json({ error: `Too many feedback submissions. Try again in ${retryAfter} seconds.` }, { status: 429 });
    }

    const data = await req.json();
    
    // Validate required fields
    if (!data.message || !data.type) {
      return NextResponse.json({ error: 'Message and type are required' }, { status: 400 });
    }

    if (!adminDb) {
      console.warn('Feedback received but Firestore is not initialized:', data);
      return NextResponse.json({ 
        message: 'Feedback received (logged to server console only)',
        warning: 'Firestore not initialized'
      }, { status: 200 });
    }

    // Add to Firestore with user trace if available
    await adminDb.collection('feedback').add({
      type: data.type,
      message: data.message,
      email: data.email || session?.user?.email || 'anonymous',
      userId: session?.user?.id || null,
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Feedback received' }, { status: 200 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
