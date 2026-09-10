import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/connectors")({
  beforeLoad: () => {
    throw redirect({ to: "/app/integrations" });
  },
});
