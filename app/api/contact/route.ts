import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { headers } from 'next/headers';

// Simple in-memory rate limiter (per-instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS = 5; // 5 messages per hour

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
    
    if (rateData.count >= MAX_REQUESTS) {
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
      return NextResponse.json({ success: true }); // Silent fail for bots
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    await adminDb.collection('contact_messages').add({
      name,
      email,
      subject: subject || 'No Subject',
      message,
      ip,
      createdAt: new Date().toISOString(),
    });

    // Update rate limit
    rateData.count++;
    rateLimitMap.set(ip, rateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
