import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodTypeAny } from "zod";
import { validateRateLimit, validateSellerApiKey } from "@/lib/seller-guard";

type ExecuteSellerServiceOptions<TInput, TResult> = {
  request: NextRequest;
  route: string;
  schema: ZodTypeAny;
  run: (input: TInput) => TResult;
};

export async function executeSellerService<TInput, TResult>({
  request,
  route,
  schema,
  run,
}: ExecuteSellerServiceOptions<TInput, TResult>) {
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
    const payload = await request.json();
    const input = schema.parse(payload) as TInput;
    const result = run(input);
    console.info("seller_service_request", {
      requestId,
      route,
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
      route,
      status,
      durationMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: message, requestId }, { status });
  }
}
