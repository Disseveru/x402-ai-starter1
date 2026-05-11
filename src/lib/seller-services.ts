import { z } from "zod";

const MAX_CONTACT_CONTENT_LENGTH = 20_000;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 15;

export const extractContactSignalsSchema = z.object({
  content: z.string().min(20).max(MAX_CONTACT_CONTENT_LENGTH),
  maxResults: z.number().int().min(1).max(25).default(10),
});

export type ExtractContactSignalsInput = z.infer<
  typeof extractContactSignalsSchema
>;

export const scoreLeadSchema = z.object({
  companySize: z.number().int().min(1).max(1_000_000),
  budgetUsd: z.number().int().min(0).max(1_000_000_000),
  timelineDays: z.number().int().min(1).max(3650),
  decisionMakerEngaged: z.boolean(),
  useCaseClarity: z.enum(["low", "medium", "high"]),
});

export type ScoreLeadInput = z.infer<typeof scoreLeadSchema>;

export const outputValidationSchema = z.object({
  outputJson: z.string().min(2).max(50_000),
  requiredFields: z.array(z.string().min(1).max(100)).min(1).max(50),
  sourceSnippets: z.array(z.string().min(5).max(4000)).min(1).max(100),
});

export type OutputValidationInput = z.infer<typeof outputValidationSchema>;

export const complianceRiskSchema = z.object({
  amountUsd: z.number().min(0).max(10_000_000),
  destinationCountry: z.string().length(2).transform((value) => value.toUpperCase()),
  transactionType: z.enum([
    "payout",
    "procurement",
    "booking",
    "subscription",
    "trading",
    "donation",
  ]),
  userKycLevel: z.enum(["none", "basic", "enhanced"]),
  sanctionsFlag: z.boolean(),
  pepFlag: z.boolean(),
  piiPayload: z.boolean(),
});

export type ComplianceRiskInput = z.infer<typeof complianceRiskSchema>;

export const eventFeedRankerSchema = z.object({
  nowIso: z.string().datetime().optional(),
  events: z
    .array(
      z.object({
        id: z.string().min(1).max(100),
        title: z.string().min(3).max(300),
        source: z.string().min(2).max(120),
        publishedAtIso: z.string().datetime(),
        relevance: z.number().min(0).max(1),
        confidence: z.number().min(0).max(1),
      })
    )
    .min(1)
    .max(200),
  maxResults: z.number().int().min(1).max(50).default(10),
});

export type EventFeedRankerInput = z.infer<typeof eventFeedRankerSchema>;

const orchestrationTaskSchema = z.object({
  id: z.string().min(1).max(100),
  dependsOn: z.array(z.string().min(1).max(100)).max(30).default([]),
  priority: z.number().int().min(1).max(10).default(5),
  estimatedSeconds: z.number().int().min(1).max(86400),
});

export const orchestrationPlanSchema = z.object({
  tasks: z.array(orchestrationTaskSchema).min(1).max(200),
});

export type OrchestrationPlanInput = z.infer<typeof orchestrationPlanSchema>;

function uniqueLower(values: string[]) {
  return [...new Set(values.map((value) => value.trim().toLowerCase()))];
}

function pickTop(values: string[], maxResults: number) {
  return values.slice(0, maxResults);
}

function hasValidPhoneDigitLength(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  return (
    digitsOnly.length >= MIN_PHONE_DIGITS &&
    digitsOnly.length <= MAX_PHONE_DIGITS
  );
}

export function extractContactSignals(input: ExtractContactSignalsInput) {
  const parsed = extractContactSignalsSchema.parse(input);

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex =
    /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g;
  const urlRegex = /https?:\/\/[^\s<>"')]+/g;

  const emails = uniqueLower(parsed.content.match(emailRegex) ?? []);
  const phones = uniqueLower(parsed.content.match(phoneRegex) ?? []).filter(
    hasValidPhoneDigitLength
  );
  const urls = uniqueLower(parsed.content.match(urlRegex) ?? []);
  const hasContactSignals = emails.length > 0 || phones.length > 0 || urls.length > 0;

  return {
    emails: pickTop(emails, parsed.maxResults),
    phones: pickTop(phones, parsed.maxResults),
    urls: pickTop(urls, parsed.maxResults),
    summary: {
      emailCount: emails.length,
      phoneCount: phones.length,
      urlCount: urls.length,
      hasContactSignals,
    },
  };
}

const clarityScoreMap: Record<ScoreLeadInput["useCaseClarity"], number> = {
  low: 5,
  medium: 15,
  high: 25,
};

export function scoreLead(input: ScoreLeadInput) {
  const parsed = scoreLeadSchema.parse(input);

  const budgetScore = Math.min(30, Math.floor(parsed.budgetUsd / 1000));
  const sizeScore = Math.min(25, Math.floor(Math.log10(parsed.companySize) * 10));
  const timelineScore = Math.max(0, 25 - Math.floor(parsed.timelineDays / 7));
  const decisionMakerScore = parsed.decisionMakerEngaged ? 20 : 0;
  const clarityScore = clarityScoreMap[parsed.useCaseClarity];

  const rawScore =
    budgetScore + sizeScore + timelineScore + decisionMakerScore + clarityScore;
  const score = Math.max(0, Math.min(100, rawScore));

  const tier =
    score >= 75
      ? "hot"
      : score >= 45
        ? "warm"
        : "cold";

  const recommendation =
    tier === "hot"
      ? "Prioritize immediate outreach."
      : tier === "warm"
        ? "Nurture with targeted follow-up."
        : "Use low-touch nurture sequence.";

  return {
    score,
    tier,
    recommendation,
    breakdown: {
      budgetScore,
      sizeScore,
      timelineScore,
      decisionMakerScore,
      clarityScore,
    },
  };
}

function safeJsonParse(value: string) {
  try {
    return { ok: true as const, data: JSON.parse(value) as unknown };
  } catch {
    return { ok: false as const };
  }
}

function extractObjectKeys(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }
  return Object.keys(value);
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 2);
}

function sourceSupportsValue(sourceBlob: string, value: string | number) {
  if (typeof value === "number") {
    return sourceBlob.includes(String(value));
  }
  const tokens = tokenize(value);
  if (tokens.length === 0) {
    return sourceBlob.includes(value.toLowerCase());
  }
  return tokens.every((token) => sourceBlob.includes(token));
}

export function validateOutputAgainstSources(input: OutputValidationInput) {
  const parsed = outputValidationSchema.parse(input);
  const parsedJson = safeJsonParse(parsed.outputJson);
  if (!parsedJson.ok) {
    return {
      validJson: false,
      sourceCoverageRatio: 0,
      fieldCoverageRatio: 0,
      missingFields: parsed.requiredFields,
      unsupportedClaims: [],
      riskScore: 100,
      verdict: "reject",
      reason: "Output is not valid JSON.",
    };
  }

  const keys = extractObjectKeys(parsedJson.data);
  const keySet = new Set(keys);
  const missingFields = parsed.requiredFields.filter((field) => !keySet.has(field));

  const sourceBlob = parsed.sourceSnippets.join(" ").toLowerCase();
  const unsupportedClaims = keys.filter((key) => {
    const value = (parsedJson.data as Record<string, unknown>)[key];
    if (typeof value !== "string" && typeof value !== "number") {
      return false;
    }
    return !sourceSupportsValue(sourceBlob, value);
  });

  const fieldCoverageRatio =
    parsed.requiredFields.length === 0
      ? 1
      : (parsed.requiredFields.length - missingFields.length) /
        parsed.requiredFields.length;
  const sourceCoverageRatio = keys.length === 0 ? 0 : (keys.length - unsupportedClaims.length) / keys.length;

  const riskScore = Math.max(
    0,
    Math.min(
      100,
      Math.round((1 - fieldCoverageRatio) * 55 + (1 - sourceCoverageRatio) * 45)
    )
  );

  const verdict = riskScore >= 70 ? "reject" : riskScore >= 35 ? "review" : "pass";

  return {
    validJson: true,
    sourceCoverageRatio,
    fieldCoverageRatio,
    missingFields,
    unsupportedClaims,
    riskScore,
    verdict,
    reason:
      verdict === "pass"
        ? "Output satisfies required fields with acceptable source support."
        : verdict === "review"
          ? "Output partially supported; manual review is recommended."
          : "Output has insufficient schema/source support.",
  };
}

// Keep this starter list intentionally conservative and review monthly against an
// authoritative sanctions source (for example OFAC/UN) before production use.
const highRiskCountries = new Set(["AF", "IR", "KP", "SY", "RU"]);
const highRiskTypes = new Set(["trading", "donation"]);

export function scoreComplianceRisk(input: ComplianceRiskInput) {
  const parsed = complianceRiskSchema.parse(input);
  let riskScore = 0;

  if (parsed.sanctionsFlag) riskScore += 70;
  if (parsed.pepFlag) riskScore += 20;
  if (parsed.piiPayload) riskScore += 10;
  if (highRiskCountries.has(parsed.destinationCountry)) riskScore += 20;
  if (highRiskTypes.has(parsed.transactionType)) riskScore += 10;
  if (parsed.userKycLevel === "none") riskScore += 25;
  if (parsed.userKycLevel === "basic") riskScore += 10;
  if (parsed.amountUsd >= 50_000) riskScore += 20;
  else if (parsed.amountUsd >= 10_000) riskScore += 10;

  riskScore = Math.max(0, Math.min(100, riskScore));

  const decision =
    riskScore >= 75
      ? "block"
      : riskScore >= 40
        ? "manual_review"
        : "approve";

  return {
    riskScore,
    decision,
    checks: {
      sanctionsFlag: parsed.sanctionsFlag,
      pepFlag: parsed.pepFlag,
      highRiskCountry: highRiskCountries.has(parsed.destinationCountry),
      highRiskType: highRiskTypes.has(parsed.transactionType),
      amountBand:
        parsed.amountUsd >= 50_000
          ? "high"
          : parsed.amountUsd >= 10_000
            ? "medium"
            : "low",
    },
  };
}

export function rankRealtimeEvents(input: EventFeedRankerInput) {
  const parsed = eventFeedRankerSchema.parse(input);
  const now = parsed.nowIso ? Date.parse(parsed.nowIso) : Date.now();

  const ranked = parsed.events
    .map((event) => {
      const ageHours = Math.max(
        0,
        (now - Date.parse(event.publishedAtIso)) / (1000 * 60 * 60)
      );
      const freshness = Math.max(0, 1 - ageHours / 72);
      const score =
        event.relevance * 0.5 + event.confidence * 0.3 + freshness * 0.2;
      return {
        ...event,
        ageHours: Number(ageHours.toFixed(2)),
        freshness: Number(freshness.toFixed(4)),
        score: Number(score.toFixed(4)),
      };
    })
    .sort((a, b) => b.score - a.score || a.ageHours - b.ageHours)
    .slice(0, parsed.maxResults);

  return {
    ranked,
    summary: {
      evaluated: parsed.events.length,
      returned: ranked.length,
      topScore: ranked[0]?.score ?? 0,
    },
  };
}

export function buildOrchestrationPlan(input: OrchestrationPlanInput) {
  const parsed = orchestrationPlanSchema.parse(input);
  const tasksById = new Map(parsed.tasks.map((task) => [task.id, task]));
  const indegree = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  for (const task of parsed.tasks) {
    indegree.set(task.id, 0);
    outgoing.set(task.id, []);
  }

  for (const task of parsed.tasks) {
    for (const dep of task.dependsOn) {
      if (!tasksById.has(dep)) {
        throw new Error(`Invalid dependency: ${task.id} depends on missing task ${dep}`);
      }
      indegree.set(task.id, (indegree.get(task.id) ?? 0) + 1);
      outgoing.get(dep)?.push(task.id);
    }
  }

  const ready = parsed.tasks
    .filter((task) => (indegree.get(task.id) ?? 0) === 0)
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));

  const ordered: string[] = [];
  while (ready.length > 0) {
    const next = ready.shift();
    if (!next) break;
    ordered.push(next.id);
    for (const dependent of outgoing.get(next.id) ?? []) {
      const remaining = (indegree.get(dependent) ?? 0) - 1;
      indegree.set(dependent, remaining);
      if (remaining === 0) {
        const dependentTask = tasksById.get(dependent);
        if (dependentTask) {
          ready.push(dependentTask);
          ready.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
        }
      }
    }
  }

  if (ordered.length !== parsed.tasks.length) {
    throw new Error("Task graph contains a cycle.");
  }

  const batches: string[][] = [];
  const completed = new Set<string>();
  let pending = new Set(ordered);

  while (pending.size > 0) {
    const currentBatch = [...pending]
      .map((id) => tasksById.get(id)!)
      .filter((task) => task.dependsOn.every((dep) => completed.has(dep)))
      .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))
      .map((task) => task.id);

    if (currentBatch.length === 0) {
      throw new Error("Unable to create execution batches due to dependency cycle.");
    }

    batches.push(currentBatch);
    for (const id of currentBatch) {
      completed.add(id);
      pending.delete(id);
    }
  }

  const totalEstimatedSeconds = ordered.reduce(
    (total, id) => total + (tasksById.get(id)?.estimatedSeconds ?? 0),
    0
  );

  return {
    orderedTaskIds: ordered,
    executionBatches: batches,
    totalEstimatedSeconds,
  };
}
