import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/conversations/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
