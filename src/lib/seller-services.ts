import { z } from "zod";

export const extractContactSignalsSchema = z.object({
  content: z.string().min(20).max(20000),
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

function uniqueLower(values: string[]) {
  return [...new Set(values.map((value) => value.trim().toLowerCase()))];
}

function pickTop(values: string[], maxResults: number) {
  return values.slice(0, maxResults);
}

function hasValidPhoneDigitLength(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
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
