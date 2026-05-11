import { NextRequest } from "next/server";
import { executeSellerService } from "@/lib/seller-api";
import { eventFeedRankerSchema, rankRealtimeEvents } from "@/lib/seller-services";

export const POST = async (request: NextRequest) => {
  return executeSellerService({
    request,
    route: "/api/v1/event-feed-ranker",
    schema: eventFeedRankerSchema,
    run: rankRealtimeEvents,
  });
};
