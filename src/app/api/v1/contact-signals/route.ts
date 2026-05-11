import { NextRequest } from "next/server";
import { executeSellerService } from "@/lib/seller-api";
import {
  extractContactSignals,
  extractContactSignalsSchema,
} from "@/lib/seller-services";

export const POST = async (request: NextRequest) => {
  return executeSellerService({
    request,
    route: "/api/v1/contact-signals",
    schema: extractContactSignalsSchema,
    run: extractContactSignals,
  });
};
