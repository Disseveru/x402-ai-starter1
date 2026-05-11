export const maxDuration = 60;

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, industry } = body;

    if (!company) {
      return new Response(JSON.stringify({ error: "company is required" }), { status: 400 });
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a top-tier competitive intelligence analyst. Analyze the given company and its competitive landscape with deep, multi-step reasoning. Include: market position, key competitors, strengths/weaknesses, recent moves, threats, and strategic recommendations. Cite real companies, funding rounds, product launches, and market data where possible. Be specific and data-driven.`,
      prompt: `Company: ${company}. Industry: ${industry || "general"}. Provide a comprehensive competitive analysis right now.`,
      maxOutputTokens: 2000,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Analysis failed", details: error.message }), { status: 500 });
  }
}
