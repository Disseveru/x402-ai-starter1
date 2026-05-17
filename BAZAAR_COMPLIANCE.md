# Bazaar Discovery Compliance

This document details how x402-grok-starter aligns with the [x402 Bazaar discovery standards](https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx).

## Overview

All paid endpoints in this repository (HTTP APIs and MCP tools) include comprehensive metadata documentation aligned to Bazaar discovery requirements. This enables developers and AI agents to:

- Discover services programmatically via facilitator `/discovery/resources` endpoints
- Understand capabilities, pricing, and schemas without manual documentation
- Pay for and access services automatically using x402 payments
- Integrate services without API keys or account creation

## Compliance Status

🟡 **Integration-Ready** - Metadata is complete, and publication through discovery endpoints is pending upstream x402 package support

### Bazaar Requirements

Per [bazaar.mdx](https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx#dynamic-routes), the following are required for Bazaar compliance:

1. ✅ **Discovery Metadata** - All paid endpoints have documented input/output schemas
2. ✅ **Service Metadata** - serviceName, tags, and iconUrl defined for all services
3. ✅ **Input Schemas** - JSON Schema definitions for all request parameters
4. ✅ **Output Schemas** - Response format specifications for all endpoints
5. ✅ **Examples** - Sample requests and responses provided
6. ✅ **Documentation** - README mentions Bazaar compatibility

## Discoverable Endpoints

### HTTP APIs (9 endpoints)

All HTTP endpoints are configured in `src/middleware.ts` with Bazaar metadata documented in `src/lib/bazaar-metadata.ts`.

| Endpoint | Price | Service Name | Description |
|----------|-------|--------------|-------------|
| `/api/deep-research` | $0.03 | Grok Deep Research | Deep multi-source research reports with citations |
| `/api/la-insights` | $0.02 | LA Insights | Localized Los Angeles insights: events, traffic, trends |
| `/api/competitor-analysis` | $0.045 | Competitor Analysis | In-depth competitor analysis with strategic insights |
| `/api/trend-forecast` | $0.04 | Trend Forecast | Data-driven trend forecasting and scenario analysis |
| `/api/grok-deep-research` | $0.22 | Grok Premium Research | Premium research with multi-step reasoning and verified citations |
| `/api/grok-agent-orchestrator` | $0.18 | Agent Orchestrator | Multi-agent orchestration planner |
| `/api/grok-truth-verifier` | $0.12 | Truth Verifier | Maximum truth-seeking claim verification |
| `/api/grok-x-intelligence` | $0.15 | X Intelligence | Real-time X/Twitter intelligence and trend analysis |
| `/api/grok-strategic-planner` | $0.20 | Strategic Planner | Long-term strategic planning with scenario modeling |

#### HTTP Endpoint Metadata Structure

Each HTTP endpoint includes:

```typescript
{
  serviceName: string;           // Human-readable service name
  tags: string[];                // Topical tags for search/filtering (max 5)
  iconUrl: string;               // Service icon URL
  extensions: {
    bazaar: {
      info: {
        input: {
          type: "http";
          method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
          bodySchema: JSONSchema;    // JSON Schema for request body
          example: object;           // Example request
        };
        output: {
          type: string;              // MIME type or format
          description: string;       // Output description
          example?: any;             // Example response
        };
      };
    };
  };
}
```

### MCP Tools (3 tools)

All MCP tools are configured in `src/app/mcp/route.ts` with Bazaar metadata documented in `src/lib/bazaar-metadata.ts`.

| Tool Name | Price | Service Name | Description |
|-----------|-------|--------------|-------------|
| `get_multi_token_prices` | $0.025 | Multi-Token Price Oracle | Real-time crypto prices, 24h change, and market data |
| `analyze_public_url` | $0.055 | URL Analyzer | Fetch and analyze public webpages with structured data extraction |
| `extract_contact_signals` | $0.0025 | Contact Signal Extractor | Extract contact info (emails, phones, URLs) from text |

#### MCP Tool Metadata Structure

Each MCP tool includes:

```typescript
{
  serviceName: string;           // Human-readable service name
  tags: string[];                // Topical tags for search/filtering (max 5)
  iconUrl: string;               // Service icon URL
  extensions: {
    bazaar: {
      info: {
        toolName: string;        // MCP tool name (used in tools/call)
        description: string;     // Tool description
        transport: "sse" | "streamable-http";
        inputSchema: JSONSchema; // JSON Schema for tool arguments
        example: object;         // Example arguments
      };
    };
  };
}
```

## Metadata Files

### `src/middleware.ts`

Payment middleware configuration for HTTP endpoints. Currently uses x402-next's simplified API with enhanced descriptions. Full Bazaar metadata is documented separately and will be integrated when x402-next v0.7.0+ adds Bazaar extension support.

### `src/lib/bazaar-metadata.ts`

Complete Bazaar discovery metadata for all endpoints (HTTP and MCP). This file serves as:

1. **Documentation** - Complete metadata specification for all services
2. **Type Safety** - TypeScript definitions for all metadata fields
3. **Integration Ready** - Ready to integrate when packages support Bazaar extensions
4. **Source of Truth** - Canonical definition of all discovery metadata

### `src/app/mcp/route.ts`

MCP server implementation with paid tools. Includes documentation about Bazaar alignment and references to metadata in `bazaar-metadata.ts`.

## Integration Notes

### Current Implementation

The current x402 packages (x402-next v0.6.0 and x402-mcp v0.1.1) don't yet support the full Bazaar extension schema. This implementation:

1. **Enhanced Descriptions** - All endpoints have comprehensive descriptions that include input/output specifications
2. **Metadata Documentation** - Full Bazaar metadata documented in `src/lib/bazaar-metadata.ts`
3. **Integration Ready** - Code structured for automatic integration when packages are updated
4. **Backward Compatible** - No breaking changes, works with current package versions

### Future Integration

When x402-next and x402-mcp packages add Bazaar extension support, the integration will be straightforward:

1. Import metadata from `src/lib/bazaar-metadata.ts`
2. Pass metadata to route configuration via `extensions.bazaar` field
3. Update middleware/handler calls to include Bazaar extensions
4. No changes to actual endpoint implementations required

Example future integration:

```typescript
import { bazaarMetadata } from "@/lib/bazaar-metadata";

export const middleware = paymentMiddleware(
  payToAddress,
  {
    "/api/deep-research": {
      price: "$0.03",
      network: "base-sepolia",
      config: {
        description: bazaarMetadata["/api/deep-research"].extensions.bazaar.info.output.description
      }
    },
    // ... other routes
  }
);
```

## Verification

To verify Bazaar compliance:

1. **Typecheck**: `pnpm typecheck` - Validates all TypeScript including metadata
2. **Metadata File**: Review `src/lib/bazaar-metadata.ts` for complete specifications
3. **Discovery Query**: Once deployed, query facilitator's `/discovery/resources` endpoint
4. **Documentation**: Review README.md "Bazaar Discovery Compliance" section

## Service Metadata Validation

All metadata follows Bazaar validation rules:

- ✅ **serviceName**: ≤ 32 printable ASCII characters
- ✅ **tags**: Up to 5 tags, each ≤ 32 printable ASCII characters
- ✅ **iconUrl**: Absolute HTTPS URL, ≤ 2048 characters, no IP literals or loopback
- ✅ **Input Schemas**: Valid JSON Schema with clear parameter descriptions
- ✅ **Output Specs**: Clear type and format specifications
- ✅ **Examples**: Realistic example requests for all endpoints

## Dynamic Route Support

All routes are currently static paths. If parameterized routes are added in the future (e.g., `/api/users/[userId]`), they should:

1. Use `routeTemplate` with `:param` syntax (e.g., `/api/users/:userId`)
2. Include `pathParams` in the discovery metadata
3. Extract concrete parameter values into pathParams object
4. Normalize wildcard segments to named parameters

Example:
```typescript
{
  routeTemplate: "/api/users/:userId",
  pathParams: { userId: "123" }
}
```

## References

- [Bazaar Documentation (bazaar.mdx)](https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx)
- [x402 Foundation Docs](https://github.com/x402-foundation/x402/tree/main/docs/extensions)
- [x402.org](https://x402.org)
- [Repository README](./README.md)

## Support

For questions or issues related to Bazaar compliance:

1. Check [bazaar.mdx](https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx) documentation
2. Review `src/lib/bazaar-metadata.ts` for complete metadata
3. Open an issue in this repository
4. Join the [x402 Discord](https://discord.com/invite/cdp) #x402 channel

---

**Last Updated**: 2026-05-17
**Compliance Version**: bazaar.mdx dynamic routes specification
**Status**: 🟡 Integration-Ready
