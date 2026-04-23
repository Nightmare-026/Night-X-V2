import { auth } from "@/auth";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tool = searchParams.get("tool");

  if (!tool) {
    return NextResponse.json({ error: "Tool name required" }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  const usageId = `${session.user.id}_${tool}_${today}`;

  try {
    const doc = await adminDb.collection("ai_usage").doc(usageId).get();
    const count = doc.exists ? doc.data()?.count || 0 : 0;

    return NextResponse.json({
      count: count,
      limit: 30,
      remaining: 30 - count
    });
  } catch (error) {
    console.error("AI Usage API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
