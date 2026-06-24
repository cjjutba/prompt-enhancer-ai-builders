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
const PROVIDER = "openrouter";

const createRequestId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `enhance-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const formatLogDetails = (details: Record<string, unknown>) =>
  JSON.stringify(details);

const logInfo = (message: string, details: Record<string, unknown>) => {
  console.info(`${message} ${formatLogDetails(details)}`);
};

const logWarn = (message: string, details: Record<string, unknown>) => {
  console.warn(`${message} ${formatLogDetails(details)}`);
};

const logError = (message: string, details: Record<string, unknown>) => {
  console.error(`${message} ${formatLogDetails(details)}`);
};

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
  const model = process.env.OPENROUTER_MODEL || FALLBACK_MODEL;
  const requestId = createRequestId();

  if (!apiKey) {
    logWarn("[Prompt Enhancer] AI generation not configured", {
      model,
      provider: PROVIDER,
      requestId,
    });

    return Response.json(
      { error: "Prompt generation is not configured yet." },
      { status: 503 },
    );
  }

  const startedAt = Date.now();

  logInfo("[Prompt Enhancer] AI generation started", {
    answerCount: Object.keys(answers).length,
    model,
    provider: PROVIDER,
    requestId,
  });

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-OpenRouter-Title": "Prompt Enhancer for AI App Builders",
      },
      body: JSON.stringify({
        model,
        messages: buildOpenRouterMessages(answers),
        temperature: 0.35,
        max_tokens: 2400,
      }),
    });

    if (!response.ok) {
      logError("[Prompt Enhancer] AI generation failed", {
        durationMs: Date.now() - startedAt,
        model,
        openRouterStatus: response.status,
        provider: PROVIDER,
        reason: "openrouter_non_success_status",
        requestId,
      });

      return Response.json(
        { error: "The prompt generator could not complete the request." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as OpenRouterResponse;
    const prompt = data.choices?.[0]?.message?.content;

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      logError("[Prompt Enhancer] AI generation failed", {
        durationMs: Date.now() - startedAt,
        model,
        openRouterStatus: response.status,
        provider: PROVIDER,
        reason: "empty_model_response",
        requestId,
      });

      return Response.json(
        { error: "The prompt generator returned an empty response." },
        { status: 502 },
      );
    }

    const trimmedPrompt = prompt.trim();

    logInfo("[Prompt Enhancer] AI generation succeeded", {
      durationMs: Date.now() - startedAt,
      model,
      openRouterStatus: response.status,
      outputCharacters: trimmedPrompt.length,
      provider: PROVIDER,
      requestId,
    });

    return Response.json({ prompt: trimmedPrompt });
  } catch (error) {
    logError("[Prompt Enhancer] AI generation failed", {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown error",
      model,
      provider: PROVIDER,
      reason: "request_exception",
      requestId,
    });

    return Response.json(
      { error: "The prompt generator is unavailable. Try again." },
      { status: 502 },
    );
  }
}
