import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/conversations/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
