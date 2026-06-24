import {
  getMissingDiscoveryFields,
  normalizeDiscoveryAnswers,
} from "@/lib/discovery";
import { buildOpenRouterMessages } from "@/lib/prompt-builder";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const FALLBACK_MODEL = "google/gemini-3-flash-preview";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send valid discovery answers." }, { status: 400 });
  }

  const body = payload as { answers?: unknown };
  const answers = normalizeDiscoveryAnswers(body.answers);

  if (!answers) {
    return Response.json({ error: "Discovery answers are incomplete." }, { status: 400 });
  }

  const missingFields = getMissingDiscoveryFields(answers);

  if (missingFields.length > 0) {
    return Response.json(
      { error: "Complete every discovery step before generating." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Prompt generation is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-OpenRouter-Title": "Prompt Enhancer for AI App Builders",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || FALLBACK_MODEL,
        messages: buildOpenRouterMessages(answers),
        temperature: 0.35,
        max_tokens: 2400,
      }),
    });

    if (!response.ok) {
      return Response.json(
        { error: "The prompt generator could not complete the request." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as OpenRouterResponse;
    const prompt = data.choices?.[0]?.message?.content;

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return Response.json(
        { error: "The prompt generator returned an empty response." },
        { status: 502 },
      );
    }

    return Response.json({ prompt: prompt.trim() });
  } catch {
    return Response.json(
      { error: "The prompt generator is unavailable. Try again." },
      { status: 502 },
    );
  }
}
