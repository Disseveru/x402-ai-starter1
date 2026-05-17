# x402 + Grok AI Starter Kit (Grok-Enhanced Fork)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDisseveru%2Fx402-grok-starter&env=CDP_API_KEY_ID,CDP_API_KEY_SECRET,CDP_WALLET_SECRET,XAI_API_KEY&envDescription=Coinbase%20Developer%20Platform%20%2B%20xAI%20Grok%20credentials&envLink=https%3A%2F%2Fdocs.cdp.coinbase.com%2Fapi-reference%2Fv2%2Fauthentication&project-name=x402-grok-starter&repository-name=x402-grok-starter&demo-title=x402%20%2B%20Grok%20AI%20Starter&demo-description=Fullstack%20x402%20template%20powered%20by%20real%20Grok-3%20from%20xAI&demo-url=https%3A%2F%2Fx402-grok-starter.vercel.app%2F&demo-image=https%3A%2F%2Fx402-grok-starter.vercel.app%2Fscreenshot.png)]

**This is the Grok-enhanced fork of the official Vercel x402 AI Starter.**

It now runs on **real Grok-3** (latest xAI model) via the official `https://api.x.ai/v1` endpoint — not a fake simulation.

Original base: [vercel-labs/x402-ai-starter](https://github.com/vercel-labs/x402-ai-starter)

[x402](https://x402.org) is a new protocol built on top of HTTP for doing fully accountless payments easily, quickly, cheaply and securely.

This template built with [Next.js](https://nextjs.org), [AI SDK](https://ai-sdk.dev), [AI Elements](https://ai-elements.dev), [AI Gateway](https://vercel.com/ai-gateway), [Coinbase CDP](https://docs.cdp.coinbase.com/), and **real Grok-3 from xAI** shows off using x402 with a modern AI stack.

**Demo (Grok-powered):** Coming soon after rename & deploy

## Features

- AI Chat + API playground to see x402 in action
- **Real Grok-3 powered agents** (Deep Research, Truth Verifier, X Intelligence, Agent Orchestrator, Strategic Planner, etc.)
- AI agent that can pay for tools
- Remote MCP server with "paid" tools
- Paywalled APIs
- Paywalled pages (for bots)
- Secure server managed wallets
- Sellable paid services (same as original + Grok intelligence layer)
- **Bazaar Discovery Compatible** - All endpoints include comprehensive metadata for discovery via x402 Bazaar

## Tech Stack

- [Next.js](https://nextjs.org/)
- [AI SDK](https://ai-sdk.dev)
- [AI Elements](https://ai-elements.dev)
- [AI Gateway](https://vercel.com/ai-gateway)
- [Coinbase CDP](https://docs.cdp.coinbase.com/)
- [x402](https://x402.org)
- **xAI Grok-3** (real endpoint)

## Getting Started

```bash
git clone https://github.com/Disseveru/x402-grok-starter
cd x402-grok-starter
pnpm install
```

## Running Locally

1. Sign into the [Coinbase CDP portal](https://portal.cdp.coinbase.com)

2. Get your **xAI API key** at https://console.x.ai/

3. Following `.env.example`, set the following environment variables in `.env.local`:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`
- `XAI_API_KEY` (required for all Grok routes)
- `NETWORK=base` (mainnet — we moved off testnet)
- `URL` (defaults to `http://localhost:3000` in local dev)
- Optional hardening:
  - `SELLER_API_KEY` (required in `x-seller-api-key` header when set)
  - `SELLER_RATE_LIMIT_PER_MINUTE` (default `60`)

Using AI Gateway requires either a Vercel OIDC token, or an API Key.
To get an OIDC token, simply run `vc link` then `vc env pull`. An API can be obtained from the [AI Gateway dashboard](https://vercel.com/ai-gateway).

Using AI Gateway isn't required, you can use any AI SDK model provider and its associated credentials.

4. Run `pnpm dev`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Testing Payments

By default, the app uses the `base` network (mainnet). Make sure your CDP wallet has sufficient USDC.

## Grok Agent Suite (New!)

This fork includes a full suite of specialized Grok-powered services:
- GrokDeepResearch
- GrokTruthVerifier
- GrokXIntelligence
- GrokAgentOrchestrator
- GrokStrategicPlanner

All powered by real **Grok-3** from xAI.

See `GROK_AGENT_SUITE.md` for full details.

## Bazaar Discovery Compliance

This repository is compliant with the [x402 Bazaar discovery standards](https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx). All paid endpoints (HTTP APIs and MCP tools) include comprehensive metadata for automatic discovery via the x402 Bazaar discovery layer.

### Discoverable Endpoints

**HTTP APIs** (9 endpoints):
- `/api/deep-research` - Deep multi-source research reports with citations
- `/api/la-insights` - Localized Los Angeles insights
- `/api/competitor-analysis` - In-depth competitor analysis
- `/api/trend-forecast` - Data-driven trend forecasting
- `/api/grok-deep-research` - Premium Grok Deep Research (multi-step reasoning)
- `/api/grok-agent-orchestrator` - Multi-agent orchestration planner
- `/api/grok-truth-verifier` - Maximum truth-seeking claim verification
- `/api/grok-x-intelligence` - Real-time X/Twitter intelligence
- `/api/grok-strategic-planner` - Long-term strategic planning

**MCP Tools** (3 tools):
- `get_multi_token_prices` - Real-time crypto prices and market data
- `analyze_public_url` - Fetch and analyze public webpages
- `extract_contact_signals` - Extract contact info from text

### Bazaar Metadata

All endpoints include:
- **Descriptions** - Clear, searchable descriptions of what each endpoint does
- **Input Schemas** - JSON Schema definitions for request parameters
- **Output Schemas** - Response format specifications
- **Examples** - Sample requests and responses
- **Service Metadata** - Service names, tags, and icons (ready for integration when x402-next v0.7.0+ is available)

The full Bazaar metadata is documented in `src/lib/bazaar-metadata.ts` and will be automatically integrated once the x402-next and x402-mcp packages add full Bazaar extension support.

### Discovery via Bazaar

Once listed in a facilitator's discovery catalog, developers and AI agents can:
1. Query `/discovery/resources` to find available services
2. Filter by price, capabilities, and requirements
3. Use x402 to pay for and access services automatically
4. No manual setup, API keys, or account creation required

For more information, see the [Bazaar documentation](https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx).

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Deploy to Vercel

1. Rename this repo to `x402-grok-starter` (recommended)
2. Push your code to GitHub.
3. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
4. Add environment variables in Vercel (including `XAI_API_KEY`).

## Moving to mainnet

`NETWORK=base` is already set (we switched from base-sepolia).

Make sure that the `Purchaser` account has enough funds to pay for the tools you're using.

**Recommended repo name:** `x402-grok-starter` (clean, professional, reflects real Grok-3 integration)
