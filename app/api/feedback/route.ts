import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.message || !data.type) {
      return NextResponse.json({ error: 'Message and type are required' }, { status: 400 });
    }

    if (!adminDb) {
      console.warn('Feedback received but Firestore is not initialized:', data);
      // In production, we'd want this to fail or use a fallback, 
      // but for now we return 200 to not break the UI.
      return NextResponse.json({ 
        message: 'Feedback received (logged to server console only)',
        warning: 'Firestore not initialized'
      }, { status: 200 });
    }

    // Add to Firestore
    await adminDb.collection('feedback').add({
      type: data.type,
      message: data.message,
      email: data.email || 'anonymous',
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Feedback received' }, { status: 200 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
