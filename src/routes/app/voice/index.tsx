import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/voice/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
