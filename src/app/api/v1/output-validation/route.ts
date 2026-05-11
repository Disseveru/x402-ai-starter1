import { NextRequest } from "next/server";
import { executeSellerService } from "@/lib/seller-api";
import {
  outputValidationSchema,
  validateOutputAgainstSources,
} from "@/lib/seller-services";

export const POST = async (request: NextRequest) => {
  return executeSellerService({
    request,
    route: "/api/v1/output-validation",
    schema: outputValidationSchema,
    run: validateOutputAgainstSources,
  });
};
