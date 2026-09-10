import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/widget")({
  beforeLoad: () => {
    throw redirect({ to: "/app/integrations" });
  },
});
