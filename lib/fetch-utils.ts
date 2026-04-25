/**
 * Enhanced fetch utility with timeout and 504 handling for Vercel Serverless
 */
export async function safeFetch(url: string, options: RequestInit = {}, timeoutMs: number = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle Vercel 504 Gateway Timeout
    if (response.status === 504) {
      throw new Error('The server took too long to respond (504 Gateway Timeout). Please try again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The server is taking longer than expected.');
    }
    throw err;
  }
}
