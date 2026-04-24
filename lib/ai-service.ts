/**
 * Universal AI Service (OpenRouter & HuggingFace Integration)
 */

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function generateAIResponse(
  prompt: string,
  systemInstruction: string = "You are a helpful assistant.",
  customModel?: string
) {
  const provider = process.env.AI_PROVIDER || "openrouter";
  
  if (provider === "huggingface") {
    return generateHFResponse(prompt, systemInstruction, customModel);
  } else {
    return generateOpenRouterResponse(prompt, systemInstruction, customModel);
  }
}

export async function generateAIResponseFromHistory(
  messages: ChatMessage[],
  systemInstruction: string = "You are a helpful assistant.",
  customModel?: string
) {
  const provider = process.env.AI_PROVIDER || "openrouter";
  
  if (provider === "huggingface") {
    return generateHFResponseFromHistory(messages, systemInstruction, customModel);
  } else {
    return generateOpenRouterResponseFromHistory(messages, systemInstruction, customModel);
  }
}

async function generateOpenRouterResponseFromHistory(
  messages: ChatMessage[],
  systemInstruction: string,
  customModel?: string
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = customModel || process.env.OPENROUTER_MODEL || "google/gemma-7b-it:free";

  if (!apiKey || apiKey === "your_openrouter_api_key") {
    throw new Error("OpenRouter API Key is missing");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://night-x.com",
        "X-Title": "Night X",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "system", content: systemInstruction }, ...messages],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "OpenRouter error");
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function generateHFResponseFromHistory(
  messages: ChatMessage[],
  systemInstruction: string,
  customModel?: string
) {
  const apiKey = process.env.HF_TOKEN;
  const model = customModel || process.env.HF_MODEL || "google/gemma-2-9b-it";

  if (!apiKey || apiKey === "your_huggingface_token") {
    throw new Error("HuggingFace Token is missing");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "system", content: systemInstruction }, ...messages],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "HuggingFace error");
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function generateOpenRouterResponse(
  prompt: string,
  systemInstruction: string,
  customModel?: string
) {
  return generateOpenRouterResponseFromHistory([{ role: "user", content: prompt }], systemInstruction, customModel);
}

async function generateHFResponse(
  prompt: string,
  systemInstruction: string,
  customModel?: string
) {
  return generateHFResponseFromHistory([{ role: "user", content: prompt }], systemInstruction, customModel);
}
