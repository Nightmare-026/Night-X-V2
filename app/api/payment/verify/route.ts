import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not set in environment variables');
      return NextResponse.json({ error: 'Payment service misconfigured' }, { status: 500 });
    }

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
