export const maxDuration = 60;

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sector, timeframe = "6 months" } = body;

    if (!sector) {
      return new Response(JSON.stringify({ error: "sector is required" }), { status: 400 });
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a leading futurist and trend forecaster. For the given sector, provide a data-driven forecast for the specified timeframe. Include: emerging trends, technology shifts, consumer behavior changes, regulatory risks, investment opportunities, and scenario analysis. Cite real companies, reports (e.g. Gartner, McKinsey, CB Insights), and signals. Be specific and actionable.`,
      prompt: `Sector: ${sector}. Timeframe: ${timeframe}. Deliver a professional trend forecast with real signals and predictions.`,
      maxOutputTokens: 1800,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Forecast failed", details: error.message }), { status: 500 });
  }
}
