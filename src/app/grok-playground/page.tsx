"use client";

import { useState } from "react";

const SERVICES = [
  { name: "Grok Deep Research", endpoint: "/api/grok-deep-research", price: 0.22, placeholder: "What are the latest developments in agentic AI?" },
  { name: "Grok Agent Orchestrator", endpoint: "/api/grok-agent-orchestrator", price: 0.18, placeholder: "Build a research agent that can analyze 50 companies" },
  { name: "Grok Truth Verifier", endpoint: "/api/grok-truth-verifier", price: 0.12, placeholder: "Verify: Agentic AI will replace 40% of knowledge workers by 2030" },
  { name: "Grok X Intelligence", endpoint: "/api/grok-x-intelligence", price: 0.15, placeholder: "What's trending on X about xAI right now?" },
  { name: "Grok Strategic Planner", endpoint: "/api/grok-strategic-planner", price: 0.20, placeholder: "Create a 3-year plan for an AI agent startup" },
  { name: "Competitor Analysis", endpoint: "/api/competitor-analysis", price: 0.045, placeholder: "Analyze OpenAI vs Anthropic vs xAI" },
  { name: "Trend Forecast", endpoint: "/api/trend-forecast", price: 0.04, placeholder: "Forecast AI agent adoption in 2027" },
  { name: "Deep Research (Basic)", endpoint: "/api/deep-research", price: 0.03, placeholder: "Latest breakthroughs in quantum computing" },
  { name: "LA Insights", endpoint: "/api/la-insights", price: 0.02, placeholder: "Best hidden food spots in Silver Lake right now" },
];

export default function GrokPlayground() {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cost, setCost] = useState(0);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setOutput("");
    setCost(selectedService.price);

    try {
      const res = await fetch(selectedService.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, topic: input, goal: input, claim: input, objective: input }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let result = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
          setOutput(result);
        }
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Grok Agent Suite Playground</h1>
          <p className="text-zinc-400">Test all Grok-powered services in real time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Selector */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-xl p-6 sticky top-8">
              <h3 className="font-semibold mb-4">Select Service</h3>
              <div className="space-y-2">
                {SERVICES.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedService(service)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${selectedService.name === service.name
                      ? "bg-white text-black"
                      : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm opacity-70">${service.price}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="text-sm text-zinc-400">Current Price</div>
                <div className="text-3xl font-bold mt-1">${selectedService.price}</div>
                <div className="text-xs text-zinc-500 mt-1">per call • paid via x402</div>
              </div>
            </div>
          </div>

          {/* Input & Output */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Input</h3>
                <div className="text-sm text-emerald-400">{selectedService.name}</div>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedService.placeholder}
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white resize-y"
              />

              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="mt-4 w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? "Thinking..." : `Run ${selectedService.name} — $${selectedService.price}`}
              </button>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Output</h3>
                {output && (
                  <div className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">
                    Cost: ${cost}
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                {output || (
                  <div className="text-zinc-500 italic">
                    Select a service, enter your query, and click run to see Grok in action...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-zinc-500">
          All services are protected by x402 payment protocol • Powered by Grok (xAI)
        </div>
      </div>
    </div>
  );
}
