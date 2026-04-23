import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { headers } from 'next/headers';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_SUBSCRIPTIONS = 3; // 3 subscriptions per hour per IP

export async function POST(request: Request) {
  try {
    const ip = headers().get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    const now = Date.now();
    
    // Rate limit check
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (now - rateData.lastReset > RATE_LIMIT_WINDOW) {
      rateData.count = 0;
      rateData.lastReset = now;
    }
    
    if (rateData.count >= MAX_SUBSCRIPTIONS) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    // Check if already subscribed
    const existingSub = await adminDb.collection('newsletter_subscribers')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingSub.empty) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    await adminDb.collection('newsletter_subscribers').add({
      email,
      subscribedAt: new Date().toISOString(),
      ip,
      active: true
    });

    // Update rate limit
    rateData.count++;
    rateLimitMap.set(ip, rateData);

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
