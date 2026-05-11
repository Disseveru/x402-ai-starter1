import { NextRequest } from "next/server";
import { executeSellerService } from "@/lib/seller-api";
import { complianceRiskSchema, scoreComplianceRisk } from "@/lib/seller-services";

export const POST = async (request: NextRequest) => {
  return executeSellerService({
    request,
    route: "/api/v1/compliance-risk",
    schema: complianceRiskSchema,
    run: scoreComplianceRisk,
  });
};
