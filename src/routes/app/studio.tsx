import { createFileRoute } from "@tanstack/react-router";
import AgentStudio from "../pages/AgentStudio";

export const Route = createFileRoute("/app/studio")({
  head: () => ({
    meta: [
      { title: "Agent Studio — KaliGan AI" },
      { name: "description", content: "Agent Studio in your KaliGan AI workspace." },
      { property: "og:title", content: "Agent Studio — KaliGan AI" },
      { property: "og:description", content: "Agent Studio in your KaliGan AI workspace." },
    ],
  }),
  component: AgentStudio,
});
