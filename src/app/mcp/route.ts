import { createPaidMcpHandler } from "x402-mcp";
import z from "zod";
import { facilitator } from "@coinbase/x402";
import { env } from "@/lib/env";
import { getOrCreateSellerAccount } from "@/lib/accounts";
import {
  extractContactSignals,
  extractContactSignalsSchema,
  scoreLead,
  scoreLeadSchema,
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
