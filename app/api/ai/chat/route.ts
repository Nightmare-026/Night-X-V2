import { auth } from "@/auth";
import { adminDb, incrementAIUsage } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { generateAIResponse, generateAIResponseFromHistory } from "@/lib/ai-service";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const tool = "chatbot";
  const usageId = `${session.user.id}_${tool}_${today}`;

  try {
    // 1. Check Rate Limit
    if (!adminDb) {
      return NextResponse.json({ error: "Service unavailable (Firebase not initialized)" }, { status: 503 });
    }
    const doc = await adminDb.collection("ai_usage").doc(usageId).get();
    const currentCount = doc.exists ? doc.data()?.count || 0 : 0;

    if (currentCount >= 30) {
      return NextResponse.json(
        { error: "Daily limit reached. Resets at midnight." },
        { status: 429 }
      );
    }

    const { messages: bodyMessages } = await req.json();

    // 2. Call AI Service with full history
    const aiResponse = await generateAIResponseFromHistory(
      bodyMessages,
      "You are Night X, a helpful utility hub assistant. Help users find and use the 40+ tools available on this platform."
    );

    // 3. Track usage
    try {
      await incrementAIUsage(session.user.id, tool);
    } catch (usageError) {
      console.error("Failed to track usage:", usageError);
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal Server Error",
      details: "Check AI service status or API configuration"
    }, { status: 500 });
  }
}
