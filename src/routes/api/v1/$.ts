import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error plain JS mock handler
import handler from "@/lib/mock-api-handler.js";

async function handle(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const headers = new Headers();
  return await new Promise<Response>((resolve) => {
    const res = {
      setHeader: (k: string, v: string) => headers.set(k, v),
      status(code: number) {
        return {
          json: (data: unknown) => {
            headers.set("Content-Type", "application/json");
            resolve(new Response(JSON.stringify(data), { status: code, headers }));
          },
          end: () => resolve(new Response(null, { status: code, headers })),
        };
      },
    };
    const req = { method: request.method, url: url.pathname + url.search, headers: Object.fromEntries(request.headers) };
    handler(req, res);
  });
}

export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
      PUT: async ({ request }) => handle(request),
      PATCH: async ({ request }) => handle(request),
      DELETE: async ({ request }) => handle(request),
      OPTIONS: async ({ request }) => handle(request),
    },
  },
});
