import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic = "general", limit = 8 } = body;

    // TODO: Replace with real LA data sources + AI summarization
    const insights = {
      topic,
      location: "Los Angeles, CA",
      insights: [
        `Real-time traffic update for ${topic} in LA` ,
        `Trending local events this week related to ${topic}`,
        `Market sentiment for ${topic} in Los Angeles area`,
        `Weather & outdoor activity impact for ${topic}`,
      ].slice(0, limit),
      lastUpdated: new Date().toISOString(),
      confidence: 0.91,
    };

    return NextResponse.json(insights);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
