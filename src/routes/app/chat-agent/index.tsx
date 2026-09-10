import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat-agent/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
