import { auth } from "@/auth";
import { adminDb, reserveAIUsage } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai-service";
import { extractJson } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tool = "ai-bio-generator";

  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Service unavailable (Firebase not initialized)" }, { status: 503 });
    }
    const reserved = await reserveAIUsage(session.user.id, tool, 30);
    if (!reserved) return NextResponse.json({ error: "Daily limit reached or quota service unavailable." }, { status: 429 });


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
      "You are a social media branding expert. Always respond in valid JSON format. Do not include any conversational text before or after the JSON."
    );

    try {
      const parsedResponse = extractJson(aiResponseText);
      
      if (!parsedResponse || !parsedResponse.bios || !Array.isArray(parsedResponse.bios)) {
        throw new Error("Invalid bio format from AI or extraction failed");
      }

      // Usage is reserved atomically before provider work.
      return NextResponse.json(parsedResponse);
    } catch (parseError: any) {
      console.error("AI Bio Parse Error:", parseError.message);
      return NextResponse.json({ error: "AI response format error" }, { status: 502 });
    }

  } catch (error: any) {
    console.error("AI Bio API General Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
