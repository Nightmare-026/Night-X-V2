import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { headers } from 'next/headers';
import { firestoreRateLimit, sanitizeInput } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const ip = headers().get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    
    // Persistent Firestore Rate Limit (5 messages per hour)
    const { success } = await firestoreRateLimit(adminDb, ip, 'contact', 5, 3600000);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, website_url } = body;

    // Honeypot check
    if (website_url) {
      console.warn(`Spam detected from IP: ${ip}`);
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Server-side Sanitization
    const cleanName = sanitizeInput(name.slice(0, 100));
    const cleanEmail = sanitizeInput(email.slice(0, 255));
    const cleanSubject = sanitizeInput((subject || 'No Subject').slice(0, 200));
    const cleanMessage = sanitizeInput(message.slice(0, 5000));

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    await adminDb.collection('contact_messages').add({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      ip,
      createdAt: new Date().toISOString(),
      status: 'new'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
