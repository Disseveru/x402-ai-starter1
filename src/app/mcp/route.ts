import { createPaidMcpHandler } from "x402-mcp";
import z from "zod";
import { facilitator } from "@coinbase/x402";
import { env } from "@/lib/env";
import { getOrCreateSellerAccount } from "@/lib/accounts";
import {
  buildOrchestrationPlan,
  complianceRiskSchema,
  eventFeedRankerSchema,
  extractContactSignals,
  extractContactSignalsSchema,
  orchestrationPlanSchema,
  outputValidationSchema,
  rankRealtimeEvents,
  scoreComplianceRisk,
  scoreLead,
  scoreLeadSchema,
  validateOutputAgainstSources,
} from "@/lib/seller-services";

let handler: ReturnType<typeof createPaidMcpHandler> | null = null;

async function getHandler() {
  if (!handler) {
    const sellerAccount = await getOrCreateSellerAccount();
    handler = createPaidMcpHandler(
      (server) => {
        server.paidTool(
          "extract_contact_signals",
          "Extract contact signals (emails, phones, URLs) from unstructured text.",
          { price: 0.0025 },
          extractContactSignalsSchema.shape,
          {},
          async (args) => {
            const result = extractContactSignals(args);
            return {
              content: [{ type: "text", text: JSON.stringify(result) }],
            };
          }
        );
        server.paidTool(
          "score_lead",
          "Score B2B leads using budget, timeline, company size, and qualification signals.",
          { price: 0.0035 },
          scoreLeadSchema.shape,
          {},
          async (args) => {
            const result = scoreLead(args);
            return {
              content: [{ type: "text", text: JSON.stringify(result) }],
            };
          }
        );
        server.paidTool(
          "validate_output_against_sources",
          "Validate JSON output structure and source support to reduce hallucination risk.",
          { price: 0.004 },
          outputValidationSchema.shape,
          {},
          async (args) => {
            const result = validateOutputAgainstSources(args);
            return {
              content: [{ type: "text", text: JSON.stringify(result) }],
            };
          }
        );
        server.paidTool(
          "score_compliance_risk",
          "Run deterministic pre-transaction compliance and risk checks.",
          { price: 0.005 },
          complianceRiskSchema.shape,
          {},
          async (args) => {
            const result = scoreComplianceRisk(args);
            return {
              content: [{ type: "text", text: JSON.stringify(result) }],
            };
          }
        );
        server.paidTool(
          "rank_realtime_events",
          "Rank real-time event feeds by relevance, confidence, and freshness.",
          { price: 0.0045 },
          eventFeedRankerSchema.shape,
          {},
          async (args) => {
            const result = rankRealtimeEvents(args);
            return {
              content: [{ type: "text", text: JSON.stringify(result) }],
            };
          }
        );
        server.paidTool(
          "build_orchestration_plan",
          "Build dependency-aware multi-agent execution batches from task graphs.",
          { price: 0.0045 },
          orchestrationPlanSchema.shape,
          {},
          async (args) => {
            const result = buildOrchestrationPlan(args);
            return {
              content: [{ type: "text", text: JSON.stringify(result) }],
            };
          }
        );
        server.tool(
          "hello-remote",
          "Receive a greeting",
          {
            name: z.string(),
          },
          async (args) => {
            return { content: [{ type: "text", text: `Hello ${args.name}` }] };
          }
        );
      },
      {
        serverInfo: {
          name: "test-mcp",
          version: "0.0.1",
        },
      },
      {
        recipient: sellerAccount.address,
        facilitator,
        network: env.NETWORK,
      }
    );
  }
  return handler;
}

export async function GET(req: Request) {
  const handler = await getHandler();
  return handler(req);
}

export async function POST(req: Request) {
  const handler = await getHandler();
  return handler(req);
}
