import { NextResponse } from "next/server";
import { hash } from "bcrypt-ts";
import { adminDb } from "@/lib/firebaseAdmin";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password, terms_accepted } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Server-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
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

    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: { id: newUserRef.id, name: userData.name, email: userData.email } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
