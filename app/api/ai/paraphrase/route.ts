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

  const tool = "ai-paraphraser";

  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const reserved = await reserveAIUsage(session.user.id, tool, 30);
    if (!reserved) return NextResponse.json({ error: "Daily limit reached or quota service unavailable." }, { status: 429 });


    const { text, tone } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Basic sanitization to prevent common prompt injection markers
    const sanitizedText = text.replace(/([#*`])/g, '\\$1').substring(0, 5000);
    const sanitizedTone = (tone || 'Standard').substring(0, 50);

    const prompt = `INSTRUCTION: Rewrite the following input text while maintaining the original meaning but changing the structure and vocabulary.
    TONE: ${sanitizedTone}
    
    ### INPUT TEXT START ###
    ${sanitizedText}
    ### INPUT TEXT END ###

    IMPORTANT: Return ONLY a valid JSON object. No conversational text, no markdown backticks unless requested, and no explanations.
    
    EXPECTED FORMAT:
    {
      "variations": [
        { "tone": "Formal", "text": "..." },
        { "tone": "Creative", "text": "..." },
        { "tone": "Casual", "text": "..." }
      ]
    }`;

    const aiResponseText = await generateAIResponse(
      prompt,
      "You are a professional paraphrasing expert. Always respond in valid JSON format. Do not include any conversational text before or after the JSON."
    );

    try {
      const parsedResponse = extractJson(aiResponseText);
      
      if (!parsedResponse || !parsedResponse.variations || !Array.isArray(parsedResponse.variations)) {
        throw new Error("Invalid paraphrase format from AI or extraction failed");
      }

      // Usage is reserved atomically before provider work.
      return NextResponse.json(parsedResponse);
    } catch (parseError: any) {
      console.error("AI Paraphrase Parse Error:", parseError.message);
      return NextResponse.json({ error: "AI response format error" }, { status: 502 });
    }

  } catch (error: any) {
    console.error("AI Paraphrase API General Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
