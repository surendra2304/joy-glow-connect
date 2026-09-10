import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/templates/$templateId/edit")({
  beforeLoad: () => {
    throw redirect({ to: "/app/templates" });
  },
});
