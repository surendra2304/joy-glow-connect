import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/actions")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
