import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt-ts";
import { adminDb } from "@/lib/firebaseAdmin";
import { firestoreRateLimit, isValidEmail } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    
    // Persistent Rate limit signups: 3 per hour per IP
    const { success } = await firestoreRateLimit(adminDb, ip, 'registration', 3, 3600000);
    if (!success) {
      return NextResponse.json(
        { message: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { name, email, password, terms_accepted, website_url, turnstileToken } = await req.json();

    // Verify Turnstile Token
    if (!turnstileToken) {
      return NextResponse.json({ message: "Security check missing" }, { status: 400 });
    }

    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const verifyRes = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'}&response=${turnstileToken}`
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json({ message: "Security check failed. Please try again." }, { status: 400 });
    }

    // Honeypot check
    if (website_url) {
      return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Robust email validation
    const emailValidation = isValidEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json({ message: emailValidation.reason }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ message: "Name is too short" }, { status: 400 });
    }

    if (!terms_accepted) {
      return NextResponse.json(
        { message: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    // Check if user already exists and create in a transaction for atomicity
    if (!adminDb) {
      return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
    }

    const userDocRef = adminDb.collection("users").doc(email.toLowerCase());
    
    try {
      const registrationResult = await adminDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        
        if (userDoc.exists) {
          return { error: "User already exists with this email", status: 400 };
        }

        // Hash password inside transaction (or just before)
        const hashedPassword = await hash(password, 12);

        const userData = {
          name,
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          terms_accepted_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          uid: userDocRef.id // Store the ID for convenience
        };

        transaction.set(userDocRef, userData);
        return { success: true, userData };
      });

      if (registrationResult.error) {
        return NextResponse.json({ message: registrationResult.error }, { status: registrationResult.status });
      }

      return NextResponse.json(
        { 
          message: "User registered successfully", 
          user: { 
            id: userDocRef.id, 
            name: name, 
            email: email.toLowerCase() 
          } 
        },
        { status: 201 }
      );
    } catch (transactionError: any) {
      console.error("Registration transaction failed:", transactionError);
      return NextResponse.json({ message: "Registration failed. Please try again." }, { status: 500 });
    }

    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
