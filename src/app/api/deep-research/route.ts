import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "query is required" }), { status: 400 });
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a world-class research analyst with access to real-time knowledge. 

For the user's query, perform deep multi-step reasoning:
1. Break down the query into key sub-questions
2. Analyze current trends, data, and expert consensus
3. Identify controversies or competing viewpoints
4. Provide specific, verifiable examples and data points
5. Cite real sources, studies, companies, or publications (use actual names like "McKinsey 2025 Report", "Harvard Business Review", specific companies, etc.)

Structure your final response with clear markdown sections:
- Executive Summary
- Key Findings (with data)
- Trends & Analysis
- Expert Opinions & Citations
- Recommendations

Be authoritative, specific, and cite real-world sources whenever possible. Never use generic statements like "according to sources" — name them.`,
      prompt: query,
      maxTokens: 2500,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Deep research streaming error:", error);
    return new Response(JSON.stringify({ error: "Research failed", details: error.message }), { status: 500 });
  }
}
