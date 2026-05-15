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
    const { objective, timeframe = "12 months", constraints = "" } = body;

    if (!objective) {
      return new Response(JSON.stringify({ error: "objective is required" }), { status: 400 });
    }

    const result = await streamText({
      model: xai("grok-4.3"),
      system: `You are Grok 4.3, a world-class strategic planner. Create comprehensive long-term strategic plans with scenario modeling.`,
      prompt: `Objective: ${objective}\nTimeframe: ${timeframe}\nConstraints: ${constraints}\n\nCreate a complete strategic plan with scenarios.`,
      maxOutputTokens: 2200,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Planning failed", details: error.message }), { status: 500 });
  }
}
