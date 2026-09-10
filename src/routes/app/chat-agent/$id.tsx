import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat-agent/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/app/agents/$id", params: { id: params.id } });
  },
});
