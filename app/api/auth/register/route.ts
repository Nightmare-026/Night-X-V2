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

    // Check if user already exists
    const userRef = adminDb.collection("users").where("email", "==", email).limit(1);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user in Firestore
    const newUserRef = adminDb.collection("users").doc();
    const userData = {
      name,
      email,
      password_hash: hashedPassword,
      terms_accepted_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await newUserRef.set(userData);

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
