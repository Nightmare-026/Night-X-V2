import { auth } from "@/auth";
import { adminDb, incrementAIUsage } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai-service";
import { extractJson } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const tool = "ai-paraphraser";
  const usageId = `${session.user.id}_${tool}_${today}`;

  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const doc = await adminDb.collection("ai_usage").doc(usageId).get();
    const currentCount = doc.exists ? doc.data()?.count || 0 : 0;

    if (currentCount >= 30) {
      return NextResponse.json(
        { error: "Daily limit reached for this tool. Resets at midnight." },
        { status: 429 }
      );
    }

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

      await incrementAIUsage(session.user.id, tool);
      return NextResponse.json(parsedResponse);
    } catch (parseError: any) {
      console.error("AI Paraphrase Parse Error:", parseError.message, "Response:", aiResponseText);
      return NextResponse.json({ 
        error: `AI Response Format Error: ${parseError.message}`,
        rawResponse: aiResponseText.substring(0, 200) 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("AI Paraphrase API General Error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal Server Error",
      details: "Check AI service status or API configuration"
    }, { status: 500 });
  }
}
