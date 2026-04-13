import { Router } from "express";
import { getHfCredentials, hfChatCompletion } from "../lib/hf.js";

const router = Router();

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  const { token, model } = getHfCredentials();
  if (!token) {
    return res.status(500).json({ error: "HF_TOKEN or HF_API_KEY not configured" });
  }

  try {
    console.log(`Chat request: Model=${model}, Message="${message}"`);

    const result = await hfChatCompletion([{ role: "user", content: String(message) }], {
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