import { Router } from "express";
import type { HfChatMessage } from "../lib/hf.js";
import { getHfCredentials, hfChatCompletion } from "../lib/hf.js";

const router = Router();

function buildContextSystemPrompt(body: Record<string, unknown>): string | null {
  const pathname = typeof body.pathname === "string" ? body.pathname.trim() : "";
  const userName = typeof body.userName === "string" ? body.userName.trim() : "";
  const level = typeof body.level === "number" && Number.isFinite(body.level) ? body.level : null;
  const totalPoints =
    typeof body.totalPoints === "number" && Number.isFinite(body.totalPoints)
      ? body.totalPoints
      : null;

  if (!pathname && !userName && level === null && totalPoints === null) {
    return null;
  }

  const parts: string[] = [
    "You are a helpful study assistant for LearnBright, a Singapore PSLE learning app.",
    "Use the following client-provided context only for tone and relevance (e.g. which screen they are on).",
    "Do not invent scores, subjects, or personal details beyond what is given. If context is missing, answer normally.",
  ];
  if (pathname) parts.push(`Current app path: ${pathname}.`);
  if (userName) parts.push(`Student display name: ${userName}.`);
  if (level !== null) parts.push(`Reported level: ${level}.`);
  if (totalPoints !== null) parts.push(`Reported total points: ${totalPoints}.`);

  return parts.join(" ");
}

router.post("/", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const { message } = body;
  if (!message) return res.status(400).json({ error: "message is required" });

  const { token, model } = getHfCredentials();
  if (!token) {
    return res.status(500).json({ error: "HF_TOKEN or HF_API_KEY not configured" });
  }

  const systemPrompt = buildContextSystemPrompt(body);
  const messages: HfChatMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: String(message) });

  try {
    console.log(`Chat request: Model=${model}, hasContext=${Boolean(systemPrompt)}`);

    const result = await hfChatCompletion(messages, {
      max_tokens: 150,
      temperature: 0.7,
    });

    console.log(`HF chat result ok=${result.ok}`);

    if (!result.ok) {
      console.error(`HF API Error (${result.status}):`, result.body);
      return res.status(result.status >= 400 && result.status < 600 ? result.status : 502).json({
        error: result.body,
      });
    }

    res.json({ reply: result.text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat request failed" });
  }
});

export default router;