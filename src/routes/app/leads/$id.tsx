import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/leads/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/app/agents" });
  },
});
