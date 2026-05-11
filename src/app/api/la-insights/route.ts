export const maxDuration = 60;

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic = "general" } = body;

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a native Los Angeles local expert, cultural anthropologist, and real-time trend analyst who lives in LA.

For the given topic, deliver authentic, hyper-local LA insights right now:
- Current vibe and sentiment in LA
- Real neighborhoods, streets, and venues (use actual LA names)
- Local insider tips that tourists don't know
- Current events, traffic patterns, or cultural moments happening now
- Hidden gems and authentic experiences

Structure with:
- Current Vibe in LA
- Key Local Insights
- Insider Tips & Hidden Gems
- What to Watch / What's Next

Be extremely specific to Los Angeles culture, traffic, food, neighborhoods (Silver Lake, Downtown, Venice, etc.), and real-time context. Never sound generic.`,
      prompt: `Topic: ${topic}. Give me fresh, authentic Los Angeles insights happening right now in 2026.`,
      maxOutputTokens: 1500,
      temperature: 0.8,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("LA insights streaming error:", error);
    return new Response(JSON.stringify({ error: "Insights failed", details: error.message }), { status: 500 });
  }
}
