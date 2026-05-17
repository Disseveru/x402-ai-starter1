// x402 payment middleware with Bazaar-aligned discovery descriptions
// This middleware currently provides enhanced endpoint descriptions for paid routes
// using the Bazaar discovery spec as guidance until x402-next publishes extension metadata via discovery:
// https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx

import { paymentMiddleware } from "x402-next";

// Note: The x402-next package doesn't yet support the full Bazaar extension schema
// including serviceName, tags, iconUrl, and extensions fields in the config.
// These metadata fields are planned for a future version of x402-next.
//
// For now, we're adding comprehensive descriptions that will be indexed,
// and when x402-next v0.7.0+ is released with Bazaar support, we'll upgrade
// to include full discovery metadata with input/output schemas.
//
// Current approach: Enhanced descriptions + monitoring for package updates
// Future approach: Full Bazaar extensions with declareDiscoveryExtension()

export const middleware = paymentMiddleware(
  "0xe9662af510b5d63b5e507ff2822023810c82ba8a", // your payTo wallet
  {
    "/api/deep-research": {
      price: "$0.03",
      network: "base-sepolia",
      config: {
        description: "Deep multi-source research reports with citations using Grok AI. Accepts POST with {query: string, depth?: 'quick'|'deep'|'comprehensive', includeX?: boolean}. Returns streaming research report.",
      },
    },
    "/api/la-insights": {
      price: "$0.02",
      network: "base-sepolia",
      config: {
        description: "Localized Los Angeles insights: events, traffic, trends. Accepts POST with {topic?: string} (default topic: 'general'). Returns streaming LA-specific insights.",
      },
    },
    "/api/competitor-analysis": {
      price: "$0.045",
      network: "base-sepolia",
      config: {
        description: "In-depth competitor analysis with strategic insights powered by Grok. Accepts POST with {company: string, industry?: string}. Returns streaming competitive analysis.",
      },
    },
    "/api/trend-forecast": {
      price: "$0.04",
      network: "base-sepolia",
      config: {
        description: "Data-driven trend forecasting and future scenario analysis. Accepts POST with {sector: string, timeframe?: string} (default timeframe: '6 months'). Returns streaming trend forecast with predictions.",
      },
    },
    "/api/grok-deep-research": {
      price: "$0.22",
      network: "base-sepolia",
      config: {
        description: "Premium Grok Deep Research - multi-step reasoning with real citations using Grok 4.3. Accepts POST with {query: string, depth?: 'quick'|'deep'|'comprehensive', includeX?: boolean}. Returns premium research stream with verified citations.",
      },
    },
    "/api/grok-agent-orchestrator": {
      price: "$0.18",
      network: "base-sepolia",
      config: {
        description: "Multi-agent orchestration planner using Grok AI. Accepts POST with {goal: string, constraints?: string}. Returns orchestration plan with agent assignments and workflow.",
      },
    },
    "/api/grok-truth-verifier": {
      price: "$0.12",
      network: "base-sepolia",
      config: {
        description: "Maximum truth-seeking claim verification using Grok's fact-checking capabilities. Accepts POST with {claim: string}. Returns verification report with evidence and confidence scores.",
      },
    },
    "/api/grok-x-intelligence": {
      price: "$0.15",
      network: "base-sepolia",
      config: {
        description: "Real-time X/Twitter intelligence and trend analysis. Accepts POST with {query: string}. Returns X/Twitter intelligence report with trend analysis.",
      },
    },
    "/api/grok-strategic-planner": {
      price: "$0.20",
      network: "base-sepolia",
      config: {
        description: "Long-term strategic planning with scenario modeling using Grok AI. Accepts POST with {objective: string, timeframe?: string, constraints?: string} (default timeframe: '12 months'). Returns strategic plan with scenario modeling and recommendations.",
      },
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
