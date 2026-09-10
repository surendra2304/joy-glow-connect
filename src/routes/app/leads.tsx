import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/leads")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
