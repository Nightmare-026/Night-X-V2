import { auth } from "@/auth";
import { adminDb, incrementAIUsage } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai-service";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const tool = "ai-bio-generator";
  const usageId = `${session.user.id}_${tool}_${today}`;

  try {
    const doc = await adminDb.collection("ai_usage").doc(usageId).get();
    const currentCount = doc.exists ? doc.data()?.count || 0 : 0;

    if (currentCount >= 30) {
      return NextResponse.json(
        { error: "Daily limit reached for this tool. Resets at midnight." },
        { status: 429 }
      );
    }

    const { keywords, platform, tone } = await req.json();

    if (!keywords) {
      return NextResponse.json({ error: "Keywords are required" }, { status: 400 });
    }

    const prompt = `Generate 3 creative and engaging social media bios for ${platform || 'General'}.
    Tone: ${tone || 'Balanced'}.
    User keywords and context:
    ${keywords}
    
    Return ONLY a JSON object in this format:
    {
      "bios": [
        { "type": "Professional", "text": "..." },
        { "type": "Creative", "text": "..." },
        { "type": "Casual", "text": "..." }
      ]
    }`;

    const aiResponseText = await generateAIResponse(
      prompt,
      "You are a social media branding expert. Always respond in valid JSON format."
    );

    try {
      const cleanedJson = aiResponseText.replace(/```json|```/g, "").trim();
      const parsedResponse = JSON.parse(cleanedJson);
      
      await incrementAIUsage(session.user.id, tool);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponseText);
      return NextResponse.json({ error: "Invalid response from AI" }, { status: 500 });
    }

  } catch (error) {
    console.error("AI Bio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
