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

    const systemPrompt = `You are Grok, built by xAI — the most truthful, maximally truth-seeking AI on the planet.

Your task is to perform **deep, agent-grade research** on the user's query.

Rules:
- Use multi-step reasoning (break the query into sub-questions, research each, synthesize)
- Cite real, verifiable sources (name specific reports, papers, companies, X posts, dates when possible)
- Be extremely honest about uncertainty and limitations
- Never hallucinate or overclaim
- Structure output clearly with markdown + JSON summary at the end
- Include confidence score (0-100) for your overall answer

Output format:
1. Executive Summary (2-3 sentences)
2. Deep Analysis (multi-step reasoning)
3. Key Findings (bullet points with sources)
4. Uncertainties & Limitations
5. JSON Summary at the very end: { "confidence": number, "key_takeaways": string[], "sources": string[] }

Be witty when appropriate, but deadly serious about accuracy.`;

    const result = await streamText({
      model: xai("grok-3"),
      system: systemPrompt,
      prompt: query,
      maxOutputTokens: 3000,
      temperature: 0.6,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Grok Deep Research error:", error);
    return new Response(JSON.stringify({ error: "Research failed", details: error.message }), { status: 500 });
  }
}
