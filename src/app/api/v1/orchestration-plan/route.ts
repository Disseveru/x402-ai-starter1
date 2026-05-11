import { NextRequest } from "next/server";
import { executeSellerService } from "@/lib/seller-api";
import { buildOrchestrationPlan, orchestrationPlanSchema } from "@/lib/seller-services";

export const POST = async (request: NextRequest) => {
  return executeSellerService({
    request,
    route: "/api/v1/orchestration-plan",
    schema: orchestrationPlanSchema,
    run: buildOrchestrationPlan,
  });
};
