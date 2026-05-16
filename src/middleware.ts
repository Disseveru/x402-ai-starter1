import { paymentProxy, x402ResourceServer } from "@x402/next";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

// Your receiving wallet address (from your .env or hardcoded for now)
const payTo = "0xe9662aF510b5d63B5E507FF2822023810C82BA8A";

// Facilitator client (using x402.org for easy testnet testing)
// Later you can switch to CDP: https://api.cdp.coinbase.com/platform/v2/x402
const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

// Create resource server and register EVM scheme for Base Sepolia
const server = new x402ResourceServer(facilitatorClient).register(
  "eip155:84532", // Base Sepolia
  new ExactEvmScheme()
);

export const middleware = paymentProxy(
  {
    // === Grok Routes ===
    "/api/grok-agent-orchestrator": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.18",
          network: "eip155:84532",
          payTo,
        },
      ],
      description: "Multi-agent orchestration planner",
      mimeType: "application/json",
    },
    "/api/grok-deep-research": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.22",
          network: "eip155:84532",
          payTo,
        },
      ],
      description: "Premium Grok Deep Research - multi-step reasoning, real citations",
      mimeType: "application/json",
    },
    "/api/grok-truth-verifier": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.12",
          network: "eip155:84532",
          payTo,
        },
      ],
      description: "Maximum truth-seeking claim verification",
      mimeType: "application/json",
    },
    "/api/grok-x-intelligence": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.15",
          network: "eip155:84532",
          payTo,
        },
      ],
      description: "Real-time X/Twitter intelligence",
      mimeType: "application/json",
    },
    "/api/grok-strategic-planner": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.20",
          network: "eip155:84532",
          payTo,
        },
      ],
      description: "Long-term strategic planning with scenario modeling",
      mimeType: "application/json",
    },

    // Add other routes here if needed (deep-research, la-insights, etc.)
  },
  server
);

export const config = {
  matcher: [
    "/api/grok-agent-orchestrator",
    "/api/grok-deep-research",
    "/api/grok-truth-verifier",
    "/api/grok-x-intelligence",
    "/api/grok-strategic-planner",
    // Add other protected routes here
  ],
  runtime: "nodejs",
};
