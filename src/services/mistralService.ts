import { KIModelSettings } from "../types/KIModelSettings";

export async function generateText(prompt: string, config: KIModelSettings) {
  const body = {
    model: config.model,
    temperature: config.temperature,
    top_p: config.top_p,
    max_tokens: config.max_tokens,
    messages: [{ role: "user", content: prompt }],
  };

  const res = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("KI-Antwort fehlgeschlagen.");
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
