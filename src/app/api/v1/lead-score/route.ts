import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { scoreLead, scoreLeadSchema } from "@/lib/seller-services";
import { validateRateLimit, validateSellerApiKey } from "@/lib/seller-guard";

export const POST = async (request: NextRequest) => {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  const apiKeyCheck = validateSellerApiKey(request);
  if (!apiKeyCheck.ok) {
    return NextResponse.json(
      { error: apiKeyCheck.error, requestId },
      { status: apiKeyCheck.status }
    );
  }

  const rateLimitCheck = validateRateLimit(request);
  if (!rateLimitCheck.ok) {
    return NextResponse.json(
      { error: rateLimitCheck.error, requestId },
      { status: rateLimitCheck.status }
    );
  }

  try {
    const input = scoreLeadSchema.parse(await request.json());
    const result = scoreLead(input);
    console.info("seller_service_request", {
      requestId,
      route: "/api/v1/lead-score",
      status: 200,
      durationMs: Date.now() - start,
    });
    return NextResponse.json({ requestId, result });
  } catch (error) {
    const status = error instanceof ZodError ? 400 : 500;
    const message =
      error instanceof ZodError
        ? "Invalid request payload"
        : "Internal service error";
    console.error("seller_service_error", {
      requestId,
      route: "/api/v1/lead-score",
      status,
      durationMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: message, requestId }, { status });
  }
};
