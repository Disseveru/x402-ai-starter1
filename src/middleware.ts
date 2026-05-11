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
    }
  },
  {
    url: "https://x402.org/facilitator"
  }
);

export const config = {
  matcher: ['/api/deep-research', '/api/la-insights']
};
