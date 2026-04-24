import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats bytes to a human-readable string
 */
/**
 * Formats bytes to a human-readable string
 */
export function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes <= 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Handle potential Infinity/NaN if bytes is extremely large or invalid
  if (!isFinite(i)) return "Unknown Size";

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Copies text to clipboard with a fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  
  if (!navigator.clipboard) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Ensure it's not visible
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("Fallback: Failed to copy text: ", err);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Async: Failed to copy text: ", err);
    return false;
  }
}

/**
 * Triggers a file download in the browser
 */
export function downloadFile(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a unique ID
 */
export function generateId(prefix: string = "") {
  return `${prefix}${nanoid(12)}`; // Increased length for safety
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Truncates string to a specific length
 */
export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Robustly extracts JSON from a string, handling Markdown code blocks and preamble
 */
export function extractJson<T = any>(str: string): T | null {
  try {
    let clean = str.trim();
    
    // Handle Markdown code blocks
    if (clean.includes("```")) {
      const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) clean = match[1].trim();
    }
    
    // Find first { or [ and last } or ]
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    const firstBracket = clean.indexOf("[");
    const lastBracket = clean.lastIndexOf("]");
    
    let startIndex = -1;
    let endIndex = -1;
    
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIndex = firstBrace;
      endIndex = lastBrace;
    } else if (firstBracket !== -1) {
      startIndex = firstBracket;
      endIndex = lastBracket;
    }
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      clean = clean.substring(startIndex, endIndex + 1);
    }
    
    return JSON.parse(clean) as T;
  } catch (e) {
    console.error("Failed to extract JSON:", e);
    return null;
  }
}

/**
 * Basic server-side sanitization to prevent XSS
 */
export function sanitizeInput(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Firestore-backed rate limiter for serverless stability
 */
export async function firestoreRateLimit(
  adminDb: any, 
  identifier: string, 
  tool: string, 
  limit: number, 
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  if (!adminDb) return { success: true, remaining: 1 };

  const now = Date.now();
  const rateLimitRef = adminDb.collection("rate_limits").doc(`${tool}_${identifier}`);

  try {
    const result = await adminDb.runTransaction(async (transaction: any) => {
      const doc = await transaction.get(rateLimitRef);
      
      if (!doc.exists) {
        transaction.set(rateLimitRef, {
          count: 1,
          resetAt: now + windowMs
        });
        return { success: true, remaining: limit - 1 };
      }

      const data = doc.data();
      if (now > data.resetAt) {
        // Window expired, reset
        transaction.update(rateLimitRef, {
          count: 1,
          resetAt: now + windowMs
        });
        return { success: true, remaining: limit - 1 };
      }

      if (data.count >= limit) {
        return { success: false, remaining: 0 };
      }

      transaction.update(rateLimitRef, {
        count: data.count + 1
      });
      return { success: true, remaining: limit - (data.count + 1) };
    });

    return result;
  } catch (err) {
    console.error("Rate limit transaction failed:", err);
    return { success: true, remaining: 1 }; // Fail open for UX
  }
}
