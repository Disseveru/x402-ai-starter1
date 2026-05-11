import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { objective, timeframe = "12 months", constraints = "" } = body;

    if (!objective) {
      return new Response(JSON.stringify({ error: "objective is required" }), { status: 400 });
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are Grok, a world-class strategic planner. Create comprehensive long-term strategic plans with scenario modeling.

For any objective, deliver:
- Strategic vision and key objectives
- Phased roadmap with milestones
- Multiple scenario analysis (best case, base case, worst case)
- Key risks and mitigation strategies
- Resource requirements
- Decision checkpoints

Be realistic, data-informed, and actionable.`,
      prompt: `Objective: ${objective}\nTimeframe: ${timeframe}\nConstraints: ${constraints}\n\nCreate a complete strategic plan with scenarios.`,
      maxTokens: 2200,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Planning failed", details: error.message }), { status: 500 });
  }
}
