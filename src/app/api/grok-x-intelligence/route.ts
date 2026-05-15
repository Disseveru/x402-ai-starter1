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
    const { query } = body;

    if (!query) {
      return new Response(JSON.stringify({ error: "query is required" }), { status: 400 });
    }

    const result = await streamText({
      model: xai("grok-4.3"),
      system: `You are Grok 4.3 with real-time X intelligence. Analyze sentiment, influencers, narratives, and trending topics on X (Twitter).`,
      prompt: query,
      maxOutputTokens: 2000,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "X Intelligence failed", details: error.message }), { status: 500 });
  }
}
