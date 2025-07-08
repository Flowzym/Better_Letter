import { KIModelSettings } from "../types/KIModelSettings";

async function generateText(prompt: string, config: KIModelSettings) {
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

async function generateCoverLetter({
  cvContent,
  jobDescription,
  basePrompt,
  styles,
  stylePrompts,
  config,
}: {
  cvContent: string;
  jobDescription: string;
  basePrompt: string;
  styles: string[];
  stylePrompts: Record<string, string>;
  config: KIModelSettings;
}) {
  const styleText = styles
    .map((s) => stylePrompts[s])
    .filter(Boolean)
    .join(", ");

  const systemPrompt =
    styleText.length > 0
      ? `${basePrompt} Schreibe im ${styleText}.`
      : basePrompt;

  const input = `${cvContent}\n\n${jobDescription}`;

  const body = {
    model: config.model,
    temperature: config.temperature,
    top_p: config.top_p,
    max_tokens: config.max_tokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: input },
    ],
  };

  const res = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("KI-Antwort fehlgeschlagen.");
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function editCoverLetter(
  originalText: string,
  edits: string,
  config: KIModelSettings,
) {
  const body = {
    model: config.model,
    temperature: config.temperature,
    top_p: config.top_p,
    max_tokens: config.max_tokens,
    messages: [
      { role: "system", content: edits },
      { role: "user", content: originalText },
    ],
  };

  const res = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("KI-Antwort fehlgeschlagen.");
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export { generateText, editCoverLetter, generateCoverLetter };

