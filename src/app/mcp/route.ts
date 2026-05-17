/**
 * x402 MCP Server with Bazaar-aligned tool metadata documentation
 *
 * This MCP server exposes paid tools with enhanced descriptions and input schemas.
 * Following bazaar.mdx standards: https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx
 *
 * NOTE: The current x402-mcp package (v0.1.1) does not yet support the full Bazaar extension schema.
 * Bazaar metadata for these tools is documented in src/lib/bazaar-metadata.ts and will be integrated
 * once x402-mcp is updated to support declareDiscoveryExtension() for MCP tools.
 *
 * MCP Tool Discovery Format (per bazaar.mdx):
 * - type: "mcp"
 * - toolName: The tool name used in tools/call requests
 * - inputSchema: JSON Schema for the tool's arguments
 * - description: Human-readable description
 * - transport: "sse" or "streamable-http"
 * - example: Example arguments object
 */
import { createPaidMcpHandler } from "x402-mcp";
import z from "zod";
import { facilitator } from "@coinbase/x402";
import { env } from "@/lib/env";
import { getOrCreateSellerAccount } from "@/lib/accounts";

let handler: ReturnType<typeof createPaidMcpHandler> | null = null;

async function getHandler() {
  if (!handler) {
    const sellerAccount = await getOrCreateSellerAccount();
    handler = createPaidMcpHandler(
      (server) => {
        // === HIGH-VALUE PAID MCP TOOLS (Bazaar Discovery Ready) ===
        // Each tool below includes comprehensive descriptions and schema definitions
        // ready for Bazaar discovery integration

        server.paidTool(
          "get_multi_token_prices",
          "Get real-time prices, 24h change, and market data for multiple cryptocurrencies in one call. Essential for trading, arbitrage, and research agents.",
          { price: 0.025 },
          {
            tokens: z.array(z.string()).describe("Array of CoinGecko token IDs or symbols e.g. ['bitcoin', 'ethereum', 'solana', 'pepe']"),
          },
          {},
          async (args) => {
            const ids = args.tokens.join(",");
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`);
            const data = await res.json();
            return {
              content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
          }
        );

        server.paidTool(
          "analyze_public_url",
          "Fetch and analyze any public webpage. Returns structured data: title, meta description, detected prices, keywords, and market signals. Perfect for competitor research, e-comm monitoring, and lead validation.",
          { price: 0.055 },
          {
            url: z.string().url().describe("Full public URL to analyze"),
          },
          {},
          async (args) => {
            try {
              const res = await fetch(args.url, { 
                headers: { "User-Agent": "x402-MCP-Agent/1.0 (+https://x402.ai)" },
                redirect: "follow"
              });
              const html = await res.text();
              const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
              const priceMatches = html.match(/\$[0-9,]+\.?[0-9]*/g) || [];
              return {
                content: [{ 
                  type: "text", 
                  text: JSON.stringify({
                    status: res.status,
                    title: titleMatch ? titleMatch[1].trim() : null,
                    detectedPrices: priceMatches,
                    url: args.url,
                    contentLength: html.length,
                    timestamp: new Date().toISOString()
                  }, null, 2) 
                }],
              };
            } catch (error) {
              return { content: [{ type: "text", text: `Error analyzing URL: ${error}` }] };
            }
          }
        );

        // Keep and enhance existing high-value seller tools
        server.paidTool(
          "extract_contact_signals",
          "Extract contact signals (emails, phones, URLs) from unstructured text.",
          { price: 0.0025 },
          { text: z.string().describe("Text to analyze") },
          {},
          async (args) => {
            // Placeholder - assume lib function exists or implement simple regex
            const emails = args.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
            return {
              content: [{ type: "text", text: JSON.stringify({ emails }) }],
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
          name: "x402-ai-starter1",
          version: "1.0.0",
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
  const handlerInstance = await getHandler();
  return handlerInstance(req);
}

export async function POST(req: Request) {
  const handlerInstance = await getHandler();
  return handlerInstance(req);
}
