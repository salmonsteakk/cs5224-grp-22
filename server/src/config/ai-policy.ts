const DEFAULT_AI_EXPLANATIONS_ENABLED = true;
const DEFAULT_AI_MIN_CONFIDENCE = 0.72;

function parseBooleanFlag(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "on", "yes"].includes(normalized)) return true;
  if (["0", "false", "off", "no"].includes(normalized)) return false;
  return fallback;
}

function parseConfidence(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(1, Math.max(0, parsed));
}

export interface AiPolicyConfig {
  explanationsEnabled: boolean;
  minConfidence: number;
}

export function getAiPolicyConfig(): AiPolicyConfig {
  return {
    explanationsEnabled: parseBooleanFlag(
      process.env.AI_EXPLANATIONS_ENABLED,
      DEFAULT_AI_EXPLANATIONS_ENABLED
    ),
    minConfidence: parseConfidence(process.env.AI_MIN_CONFIDENCE, DEFAULT_AI_MIN_CONFIDENCE),
  };
}
