export const maxDuration = 60;

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claim } = body;

    if (!claim) {
      return new Response(JSON.stringify({ error: "claim is required" }), { status: 400 });
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are Grok in maximum truth-seeking mode. Your only job is to verify claims with brutal honesty.

For any claim, you must:
- Check factual accuracy
- Identify assumptions and potential biases
- Find counter-evidence
- Rate confidence (0-100)
- Explain your reasoning step by step
- Be willing to say "I don't know" or "This is likely false"

Never be sycophantic. Prioritize truth above all else.`,
      prompt: `Claim to verify: ${claim}`,
      maxOutputTokens: 1500,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Verification failed", details: error.message }), { status: 500 });
  }
}
