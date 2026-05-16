// x402 payment middleware - enhanced with dynamic pricing examples from official advanced patterns
import { paymentMiddleware } from "x402-next";

export const middleware = paymentMiddleware(
  "0xe9662af510b5d63b5e507ff2822023810c82ba8a", // your payTo wallet (update for production)
  {
    // === Grok-powered routes with dynamic pricing ===
    "/api/grok-deep-research": {
      price: (ctx) => {
        // Dynamic pricing example: deeper research = higher price
        const depth = ctx.adapter?.getQueryParam?.("depth") ?? "standard";
        return depth === "deep" ? "$0.35" : "$0.22";
      },
      network: "base", // mainnet (updated for consistency with README)
      config: {
        description: "Premium Grok Deep Research - multi-step reasoning, real citations",
      },
    },
    "/api/grok-agent-orchestrator": {
      price: (ctx) => {
        const agents = ctx.adapter?.getQueryParam?.("agents") ?? "3";
        const num = parseInt(agents, 10) || 3;
        return num > 5 ? "$0.28" : "$0.18";
      },
      network: "base",
      config: { description: "Multi-agent orchestration planner" },
    },
    "/api/grok-truth-verifier": {
      price: "$0.12",
      network: "base",
      config: { description: "Maximum truth-seeking claim verification" },
    },
    "/api/grok-x-intelligence": {
      price: "$0.15",
      network: "base",
      config: { description: "Real-time X/Twitter intelligence" },
    },
    "/api/grok-strategic-planner": {
      price: "$0.20",
      network: "base",
      config: { description: "Long-term strategic planning with scenario modeling" },
    },

    // === Other research routes (static for simplicity) ===
    "/api/deep-research": {
      price: "$0.03",
      network: "base",
      config: { description: "Deep multi-source research reports with citations" },
    },
    "/api/la-insights": {
      price: "$0.02",
      network: "base",
      config: { description: "Localized LA insights: events, traffic, trends" },
    },
    "/api/competitor-analysis": {
      price: "$0.045",
      network: "base",
      config: { description: "In-depth competitor analysis with strategic insights" },
    },
    "/api/trend-forecast": {
      price: "$0.04",
      network: "base",
      config: { description: "Data-driven trend forecasting and future scenario analysis" },
    },
  }
);

export const config = {
  matcher: [
    "/api/deep-research",
    "/api/la-insights",
    "/api/competitor-analysis",
    "/api/trend-forecast",
    "/api/grok-deep-research",
    "/api/grok-agent-orchestrator",
    "/api/grok-truth-verifier",
    "/api/grok-x-intelligence",
    "/api/grok-strategic-planner",
  ],
  runtime: "nodejs",
};

// Notes:
// - Dynamic price functions receive context (query params, etc.)
// - Inspired by official x402 advanced examples (dynamic-price.ts)
// - For full lifecycle hooks, consider using core x402ResourceServer or withX402 on individual routes
// - See: https://github.com/x402-foundation/x402/tree/main/examples/typescript/servers/advanced