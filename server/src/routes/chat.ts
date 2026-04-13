import { Router } from "express";

const router = Router();
const HF_MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct:novita";
const HF_TOKEN = process.env.HF_TOKEN;

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });
  if (!HF_TOKEN) return res.status(500).json({ error: "HF_TOKEN not configured" });

  try {
    console.log(`Chat request: Model=${HF_MODEL}, Message="${message}"`);
    
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    console.log(`HF Response status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HF API Error (${response.status}):`, errorBody);
      return res.status(response.status).json({ error: errorBody });
    }

    const data = await response.json();
    console.log("HF Response data:", data);
    
    const text = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.json({ reply: text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat request failed" });
  }
});

export default router;