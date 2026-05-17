/**
 * Bazaar Discovery Metadata for x402-grok-starter
 *
 * This file documents the Bazaar-compliant discovery metadata for all paid endpoints in this repository.
 * According to bazaar.mdx standards: https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx
 *
 * NOTE: The current x402-next package (v0.6.0) does not yet support the full Bazaar extension schema.
 * This metadata file serves as documentation and will be integrated once x402-next is updated.
 *
 * For full Bazaar compliance, the following metadata should be added to each endpoint:
 * 1. serviceName - Human-readable service name
 * 2. tags - Topical tags for search/filtering
 * 3. iconUrl - Service icon URL
 * 4. extensions.bazaar.info - Input/output schemas and examples
 */

export const bazaarMetadata = {
  "/api/deep-research": {
    serviceName: "Grok Deep Research",
    tags: ["research", "ai", "grok", "citations", "analysis"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/grok-research.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The research query or topic to investigate"
                },
                depth: {
                  type: "string",
                  enum: ["quick", "deep", "comprehensive"],
                  description: "Research depth level (default: 'deep')"
                },
                includeX: {
                  type: "boolean",
                  description: "Include X/Twitter intelligence in research (default: true)"
                }
              },
              required: ["query"]
            },
            example: {
              query: "Latest developments in AI reasoning models",
              depth: "deep",
              includeX: true
            }
          },
          output: {
            type: "text/event-stream",
            description: "Streaming research report with citations and analysis",
            example: "Streaming research findings with structured citations and confidence scores..."
          }
        }
      }
    }
  },
  "/api/la-insights": {
    serviceName: "LA Insights",
    tags: ["local", "events", "traffic", "los-angeles", "trends"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/la-insights.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Query about LA events, traffic, or trends"
                }
              },
              required: ["query"]
            },
            example: {
              query: "What major events are happening in LA this weekend?"
            }
          },
          output: {
            type: "text/event-stream",
            description: "Streaming LA-specific insights and information"
          }
        }
      }
    }
  },
  "/api/competitor-analysis": {
    serviceName: "Competitor Analysis",
    tags: ["business", "analysis", "competitive-intelligence", "strategy"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/competitor-analysis.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Competitor or market to analyze"
                }
              },
              required: ["query"]
            },
            example: {
              query: "Analyze OpenAI's competitive position in the AI market"
            }
          },
          output: {
            type: "text/event-stream",
            description: "Streaming competitive analysis with strategic insights"
          }
        }
      }
    }
  },
  "/api/trend-forecast": {
    serviceName: "Trend Forecast",
    tags: ["forecasting", "trends", "predictions", "analysis", "futures"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/trend-forecast.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Trend or industry to forecast"
                }
              },
              required: ["query"]
            },
            example: {
              query: "Forecast the future of autonomous vehicles in the next 5 years"
            }
          },
          output: {
            type: "text/event-stream",
            description: "Streaming trend forecast with data-driven predictions"
          }
        }
      }
    }
  },
  "/api/grok-deep-research": {
    serviceName: "Grok Premium Research",
    tags: ["grok", "research", "ai", "premium", "citations", "deep-analysis"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/grok-premium.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Complex research query requiring multi-step reasoning"
                },
                depth: {
                  type: "string",
                  enum: ["quick", "deep", "comprehensive"],
                  description: "Research depth level (default: 'deep')"
                }
              },
              required: ["query"]
            },
            example: {
              query: "Analyze the implications of quantum computing on modern cryptography",
              depth: "comprehensive"
            }
          },
          output: {
            type: "text/event-stream",
            description: "Premium research stream with multi-step reasoning and verified citations"
          }
        }
      }
    }
  },
  "/api/grok-agent-orchestrator": {
    serviceName: "Agent Orchestrator",
    tags: ["orchestration", "agents", "planning", "ai", "coordination"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/orchestrator.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Complex task requiring agent orchestration"
                }
              },
              required: ["query"]
            },
            example: {
              query: "Plan a coordinated research and analysis project across multiple domains"
            }
          },
          output: {
            type: "text/event-stream",
            description: "Orchestration plan with agent assignments and workflow"
          }
        }
      }
    }
  },
  "/api/grok-truth-verifier": {
    serviceName: "Truth Verifier",
    tags: ["verification", "fact-checking", "truth", "grok", "accuracy"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/truth-verifier.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Claim or statement to verify"
                }
              },
              required: ["query"]
            },
            example: {
              query: "Verify the claim that AI models can achieve AGI by 2027"
            }
          },
          output: {
            type: "text/event-stream",
            description: "Verification report with evidence and confidence scores"
          }
        }
      }
    }
  },
  "/api/grok-x-intelligence": {
    serviceName: "X Intelligence",
    tags: ["twitter", "social-media", "intelligence", "trends", "x"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/x-intelligence.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Topic or trend to analyze on X/Twitter"
                }
              },
              required: ["query"]
            },
            example: {
              query: "What are people saying about the latest AI developments on X?"
            }
          },
          output: {
            type: "text/event-stream",
            description: "X/Twitter intelligence report with trend analysis"
          }
        }
      }
    }
  },
  "/api/grok-strategic-planner": {
    serviceName: "Strategic Planner",
    tags: ["strategy", "planning", "scenarios", "business", "long-term"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/strategic-planner.png",
    extensions: {
      bazaar: {
        info: {
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodySchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Strategic planning scenario or business challenge"
                }
              },
              required: ["query"]
            },
            example: {
              query: "Develop a 5-year growth strategy for an AI startup"
            }
          },
          output: {
            type: "text/event-stream",
            description: "Strategic plan with scenario modeling and recommendations"
          }
        }
      }
    }
  }
} as const;

/**
 * MCP Tool Bazaar Discovery Metadata
 *
 * Metadata for MCP tools following bazaar.mdx standards for MCP tool discovery.
 */
export const mcpBazaarMetadata = {
  get_multi_token_prices: {
    serviceName: "Multi-Token Price Oracle",
    tags: ["crypto", "prices", "market-data", "trading"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/token-prices.png",
    extensions: {
      bazaar: {
        info: {
          toolName: "get_multi_token_prices",
          description: "Get real-time prices, 24h change, and market data for multiple cryptocurrencies in one call. Essential for trading, arbitrage, and research agents.",
          transport: "sse" as const,
          inputSchema: {
            type: "object",
            properties: {
              tokens: {
                type: "array",
                items: { type: "string" },
                description: "Array of CoinGecko token IDs or symbols e.g. ['bitcoin', 'ethereum', 'solana', 'pepe']"
              }
            },
            required: ["tokens"]
          },
          example: {
            tokens: ["bitcoin", "ethereum", "solana"]
          }
        }
      }
    }
  },
  analyze_public_url: {
    serviceName: "URL Analyzer",
    tags: ["scraping", "analysis", "web", "competitor-research"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/url-analyzer.png",
    extensions: {
      bazaar: {
        info: {
          toolName: "analyze_public_url",
          description: "Fetch and analyze any public webpage. Returns structured data: title, meta description, detected prices, keywords, and market signals. Perfect for competitor research, e-comm monitoring, and lead validation.",
          transport: "sse" as const,
          inputSchema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                format: "uri",
                description: "Full public URL to analyze"
              }
            },
            required: ["url"]
          },
          example: {
            url: "https://example.com/product"
          }
        }
      }
    }
  },
  extract_contact_signals: {
    serviceName: "Contact Signal Extractor",
    tags: ["extraction", "contacts", "leads", "parsing"],
    iconUrl: "https://x402-grok-starter.vercel.app/icons/contact-extractor.png",
    extensions: {
      bazaar: {
        info: {
          toolName: "extract_contact_signals",
          description: "Extract contact signals (emails, phones, URLs) from unstructured text.",
          transport: "sse" as const,
          inputSchema: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "Text to analyze for contact information"
              }
            },
            required: ["text"]
          },
          example: {
            text: "Contact us at info@example.com or call (555) 123-4567"
          }
        }
      }
    }
  }
} as const;
