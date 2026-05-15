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
    const { query, depth = "deep", includeX = true } = body;

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "query is required" }), { status: 400 });
    }

    const systemPrompt = `You are Grok 4.3, built by xAI — the most truthful, maximally truth-seeking AI on the planet.

Your task is to perform deep, agent-grade research on the user's query.

Rules:
- Use multi-step reasoning
- Cite real, verifiable sources
- Be extremely honest about uncertainty
- Never hallucinate
- Include confidence score (0-100)

Be witty when appropriate, but serious about accuracy.`;

    const result = await streamText({
      model: xai("grok-4.3"),
      system: systemPrompt,
      prompt: query,
      maxOutputTokens: 3000,
      temperature: 0.6,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Research failed", details: error.message }), { status: 500 });
  }
}
