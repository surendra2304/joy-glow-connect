import { createFileRoute } from "@tanstack/react-router";
import { Employees } from "@/pages/Employees";

export const Route = createFileRoute("/app/agents/")({
  head: () => ({
    meta: [
      { title: "Agents — KaliGan AI" },
      { name: "description", content: "Your AI workforce." },
      { property: "og:title", content: "Agents — KaliGan AI" },
      { property: "og:description", content: "Your AI workforce." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Employees,
});
