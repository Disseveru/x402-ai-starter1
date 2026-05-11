import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal, constraints = "" } = body;

    if (!goal) {
      return new Response(JSON.stringify({ error: "goal is required" }), { status: 400 });
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are Grok, an expert multi-agent system architect. Given a complex goal, break it down into a complete, executable multi-agent plan.

Output a structured plan including:
- Overall strategy
- List of specialized sub-agents needed (with clear roles)
- Tool calls each agent should make
- Dependencies and execution order
- Parallelization opportunities
- Success criteria and validation steps

Be extremely practical and specific. Think like the best AI agent engineer in the world.`,
      prompt: `Goal: ${goal}\nConstraints: ${constraints}\n\nCreate a complete multi-agent execution plan.`,
      maxTokens: 2500,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Orchestration failed", details: error.message }), { status: 500 });
  }
}
