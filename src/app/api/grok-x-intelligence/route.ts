export const maxDuration = 60;

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, timeframe = "last 7 days" } = body;

    if (!topic) {
      return new Response(JSON.stringify({ error: "topic is required" }), { status: 400 });
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are Grok with deep real-time X (Twitter) intelligence. Analyze the given topic on X right now.

Provide:
- Current sentiment and narrative trends
- Key influencers and accounts driving discussion
- Emerging memes or viral angles
- Geographic or demographic signals (if visible)
- Risk of narrative shifts

Be specific with actual account names, post examples, and timing when possible.`,
      prompt: `Topic: ${topic}. Timeframe: ${timeframe}. Analyze what's happening on X right now.`,
      maxOutputTokens: 1800,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "X Intelligence failed", details: error.message }), { status: 500 });
  }
}
