import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/tickets")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
