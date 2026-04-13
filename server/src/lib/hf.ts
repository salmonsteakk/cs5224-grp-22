const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";

export type HfChatRole = "system" | "user" | "assistant";

export interface HfChatMessage {
  role: HfChatRole;
  content: string;
}

export interface HfChatOptions {
  max_tokens?: number;
  temperature?: number;
}

export function getHfCredentials(): { token: string | undefined; model: string } {
  const token = process.env.HF_TOKEN || process.env.HF_API_KEY;
  const model = process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct:novita";
  return { token, model };
}

export type HfChatResult =
  | { ok: true; text: string }
  | { ok: false; status: number; body: string };

export async function hfChatCompletion(
  messages: HfChatMessage[],
  options: HfChatOptions = {}
): Promise<HfChatResult> {
  const { token, model } = getHfCredentials();
  if (!token) {
    return { ok: false, status: 503, body: "HF_TOKEN or HF_API_KEY not configured" };
  }

  const response = await fetch(HF_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: options.max_tokens ?? 256,
      temperature: options.temperature ?? 0.6,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return { ok: false, status: response.status, body: errorBody };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const raw = data.choices?.[0]?.message?.content;
  const text = typeof raw === "string" ? raw.trim() : "";
  return { ok: true, text: text || "Sorry, I couldn't generate a response." };
}
