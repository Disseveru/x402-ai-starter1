// x402 + MCP + Bazaar middleware for paid API routes
import { paymentMiddleware } from "x402-next";

export const middleware = paymentMiddleware(
  "0xe9662af510b5d63b5e507ff2822023810c82ba8a", // your payTo wallet
  {
    'GET /api/deep-research': {
      accepts: [{
        scheme: 'exact',
        price: '$0.03',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Deep multi-source research reports with citations',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'research',
          tags: ['deep-research', 'analysis', 'intelligence']
        }
      }
    },
    'GET /api/la-insights': {
      accepts: [{
        scheme: 'exact',
        price: '$0.02',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Localized LA insights: events, traffic, trends',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'insights',
          tags: ['los-angeles', 'local', 'real-time']
        }
      }
    },
    'POST /api/competitor-analysis': {
      accepts: [{
        scheme: 'exact',
        price: '$0.045',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'In-depth competitor analysis with strategic insights and market positioning',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'business-intelligence',
          tags: ['competitor-analysis', 'strategy', 'market-research']
        }
      }
    },
    'POST /api/trend-forecast': {
      accepts: [{
        scheme: 'exact',
        price: '$0.04',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Data-driven trend forecasting and future scenario analysis',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'foresight',
          tags: ['trend-forecast', 'future-trends', 'strategy']
        }
      }
    },
    'POST /api/grok-deep-research': {
      accepts: [{
        scheme: 'exact',
        price: '$0.22',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Premium Grok Deep Research - multi-step reasoning, real citations, maximum truth-seeking',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'premium-research',
          tags: ['grok-research', 'deep-analysis', 'truth-seeking', 'xai']
        }
      }
    },
    'POST /api/grok-agent-orchestrator': {
      accepts: [{
        scheme: 'exact',
        price: '$0.18',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Multi-agent orchestration planner - breaks complex goals into executable agent plans',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'agent-infrastructure',
          tags: ['agent-orchestration', 'planning', 'multi-agent']
        }
      }
    },
    'POST /api/grok-truth-verifier': {
      accepts: [{
        scheme: 'exact',
        price: '$0.12',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Maximum truth-seeking claim verification with confidence scoring',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'verification',
          tags: ['truth-verification', 'fact-checking', 'anti-hallucination']
        }
      }
    },
    'POST /api/grok-x-intelligence': {
      accepts: [{
        scheme: 'exact',
        price: '$0.15',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Real-time X/Twitter intelligence - sentiment, influencers, narrative tracking',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'social-intelligence',
          tags: ['x-intelligence', 'twitter-analysis', 'real-time-trends']
        }
      }
    },
    'POST /api/grok-strategic-planner': {
      accepts: [{
        scheme: 'exact',
        price: '$0.20',
        network: 'eip155:8453',
        payTo: '0xe9662af510b5d63b5e507ff2822023810c82ba8a'
      }],
      description: 'Long-term strategic planning with scenario modeling and risk analysis',
      mimeType: 'application/json',
      extensions: {
        bazaar: {
          discoverable: true,
          category: 'strategy',
          tags: ['strategic-planning', 'scenario-analysis', 'foresight']
        }
      }
    }
  },
  {
    url: "https://x402.org/facilitator"
  }
);

export const config = {
  matcher: ['/api/deep-research', '/api/la-insights', '/api/competitor-analysis', '/api/trend-forecast', '/api/grok-deep-research', '/api/grok-agent-orchestrator', '/api/grok-truth-verifier', '/api/grok-x-intelligence', '/api/grok-strategic-planner']
};
