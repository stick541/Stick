import { createFileRoute } from "@tanstack/react-router";

const HOUR = 60 * 60 * 1000;
const hits = new Map<string, { n: number; reset: number }>();

function overLimit(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.reset) {
    hits.set(ip, { n: 1, reset: now + HOUR });
    return false;
  }
  row.n += 1;
  return row.n > 8;
}

export const Route = createFileRoute("/api/image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.XAI_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "Image creation is unavailable right now." }, { status: 503 });
        }
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
        if (overLimit(ip)) {
          return Response.json({ error: "Image preview limit reached for this hour." }, { status: 429 });
        }
        let prompt = "";
        try {
          const body = (await request.json()) as { prompt?: unknown };
          prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 1000) : "";
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }
        if (!prompt) return Response.json({ error: "Describe the image you want." }, { status: 400 });

        const upstream = await fetch("https://api.x.ai/v1/images/generations", {
          method: "POST",
          signal: request.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "grok-imagine-image",
            prompt,
            n: 1,
            response_format: "url",
          }),
        });
        if (!upstream.ok) {
          const unavailable = upstream.status === 401 || upstream.status === 402 || upstream.status === 403;
          return Response.json(
            {
              error: unavailable
                ? "Image creation is unavailable right now."
                : "The image could not be created. Please try again.",
            },
            { status: unavailable ? 503 : 502 },
          );
        }
        const json = (await upstream.json()) as {
          data?: { url?: string; b64_json?: string }[];
        };
        const first = json.data?.[0];
        const url = first?.url || (first?.b64_json ? `data:image/png;base64,${first.b64_json}` : "");
        if (!url) return Response.json({ error: "The image could not be created." }, { status: 502 });
        return Response.json({ url });
      },
    },
  },
});
