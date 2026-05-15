export const maxDuration = 60;

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const xai = createOpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claim } = body;

    if (!claim) {
      return new Response(JSON.stringify({ error: "claim is required" }), { status: 400 });
    }

    const result = await streamText({
      model: xai("grok-4.3"),
      system: `You are Grok 4.3 in maximum truth-seeking mode. Verify claims with brutal honesty. Rate confidence (0-100) and explain your reasoning.`,
      prompt: `Claim to verify: ${claim}`,
      maxOutputTokens: 1500,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Verification failed", details: error.message }), { status: 500 });
  }
}
