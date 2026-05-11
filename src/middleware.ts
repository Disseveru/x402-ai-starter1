// x402 payment middleware - cleaned for production build
import { paymentMiddleware } from "x402-next";

export const middleware = paymentMiddleware(
  "0xe9662af510b5d63b5e507ff2822023810c82ba8a", // your payTo wallet
  {
    "/api/deep-research": {
      price: "$0.03",
      network: "base-sepolia",
      config: {
        description: "Deep multi-source research reports with citations",
      },
    },
    "/api/la-insights": {
      price: "$0.02",
      network: "base-sepolia",
      config: {
        description: "Localized LA insights: events, traffic, trends",
      },
    },
    "/api/competitor-analysis": {
      price: "$0.045",
      network: "base-sepolia",
      config: {
        description: "In-depth competitor analysis with strategic insights",
      },
    },
    "/api/trend-forecast": {
      price: "$0.04",
      network: "base-sepolia",
      config: {
        description: "Data-driven trend forecasting and future scenario analysis",
      },
    },
    "/api/grok-deep-research": {
      price: "$0.22",
      network: "base-sepolia",
      config: {
        description: "Premium Grok Deep Research - multi-step reasoning, real citations",
      },
    },
    "/api/grok-agent-orchestrator": {
      price: "$0.18",
      network: "base-sepolia",
      config: {
        description: "Multi-agent orchestration planner",
      },
    },
    "/api/grok-truth-verifier": {
      price: "$0.12",
      network: "base-sepolia",
      config: {
        description: "Maximum truth-seeking claim verification",
      },
    },
    "/api/grok-x-intelligence": {
      price: "$0.15",
      network: "base-sepolia",
      config: {
        description: "Real-time X/Twitter intelligence",
      },
    },
    "/api/grok-strategic-planner": {
      price: "$0.20",
      network: "base-sepolia",
      config: {
        description: "Long-term strategic planning with scenario modeling",
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