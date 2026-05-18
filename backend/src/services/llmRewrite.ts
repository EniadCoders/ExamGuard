export type RewriteKind = "title" | "description" | "question" | "answer";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const DEFAULT_BASE_URL = "https://api.llmapi.ai/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

const KIND_INSTRUCTIONS: Record<RewriteKind, string> = {
  title: "Reformule le titre pour un examen. Il doit rester court, clair et academique.",
  description:
    "Reformule la description pour un professeur. Elle doit etre claire, pedagogique et concise.",
  question:
    "Reformule l'enonce de question. Conserve strictement le sens, les contraintes, les valeurs, les donnees et le niveau de difficulte.",
  answer:
    "Reformule une option de reponse QCM. Conserve strictement son sens et ne revele pas si elle est correcte.",
};

function cleanModelText(value: string): string {
  return value
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .trim();
}

export async function rewriteTextWithLlmApi(params: {
  kind: RewriteKind;
  text: string;
  subject?: string;
  title?: string;
}): Promise<string> {
  const apiKey = process.env.LLMAPI_API_KEY;
  if (!apiKey) {
    const err = new Error("LLMAPI_API_KEY is not configured");
    (err as Error & { status?: number }).status = 503;
    throw err;
  }

  const input = params.text.trim();
  if (!input) {
    const err = new Error("text is required");
    (err as Error & { status?: number }).status = 400;
    throw err;
  }

  const baseUrl = (process.env.LLMAPI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = process.env.LLMAPI_MODEL ?? DEFAULT_MODEL;
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "Tu aides un professeur a ameliorer la formulation de contenus d'examen. " +
        "Reponds uniquement avec la version reformulee, sans explication, sans markdown. " +
        "Ne change jamais la reponse attendue, les chiffres, les noms de variables, les extraits de code, ni les consignes evaluatives.",
    },
    {
      role: "user",
      content: [
        KIND_INSTRUCTIONS[params.kind],
        params.subject ? `Module: ${params.subject}` : "",
        params.title ? `Titre de l'examen: ${params.title}` : "",
        `Texte original:\n${input}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      max_tokens: Math.min(700, Math.max(80, Math.ceil(input.length / 2) + 120)),
    }),
  });

  const bodyText = await response.text();
  let body: ChatCompletionResponse | { error?: { message?: string } } | null = null;
  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      body && "error" in body && body.error?.message
        ? body.error.message
        : `LLM API request failed (${response.status})`;
    const err = new Error(message);
    (err as Error & { status?: number }).status = response.status;
    throw err;
  }

  const rewritten = cleanModelText(
    (body as ChatCompletionResponse | null)?.choices?.[0]?.message?.content ?? "",
  );
  if (!rewritten) {
    throw new Error("LLM API returned an empty rewrite");
  }
  return rewritten;
}
