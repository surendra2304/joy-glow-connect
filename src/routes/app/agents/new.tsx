import { createFileRoute } from "@tanstack/react-router";
import { AgentsNew } from "../../pages/Employees";

export const Route = createFileRoute("/app/agents/new")({
  head: () => ({ meta: [{ title: "New agent — KaliGan AI" }] }),
  component: AgentsNew,
});
