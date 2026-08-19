import { auth } from "@/auth";
import { adminDb, reserveAIUsage } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { generateAIResponseFromHistory } from "@/lib/ai-service";

export const dynamic = 'force-dynamic';

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 12000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function validateMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return null;
  }

  let totalChars = 0;
  const messages: ChatMessage[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") return null;

    const { role, content } = item as { role?: unknown; content?: unknown };
    if (typeof role !== "string" || !ALLOWED_ROLES.has(role)) return null;
    if (typeof content !== "string") return null;

    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent.length > MAX_MESSAGE_CHARS) return null;

    totalChars += trimmedContent.length;
    if (totalChars > MAX_TOTAL_CHARS) return null;

    messages.push({ role: role as ChatMessage["role"], content: trimmedContent });
  }

  return messages;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 64 * 1024) {
    return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
  }

  try {
    const { messages: bodyMessages } = await req.json();
    const messages = validateMessages(bodyMessages);
    if (!messages) {
      return NextResponse.json({ error: "Invalid or too-large chat history" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Service unavailable (Firebase not initialized)" }, { status: 503 });
    }

    const reserved = await reserveAIUsage(session.user.id, "chatbot", 30);
    if (!reserved) {
      return NextResponse.json({ error: "Daily limit reached or quota service unavailable." }, { status: 429 });
    }

    const aiResponse = await generateAIResponseFromHistory(
      messages,
      "You are Night X, a helpful utility hub assistant. Help users find and use the 40+ tools available on this platform."
    );

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: "Chat response generation failed" },
      { status: 500 }
    );
  }
}
