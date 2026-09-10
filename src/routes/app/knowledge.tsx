import { createFileRoute } from "@tanstack/react-router";
import Knowledge from "@/pages/Knowledge";

export const Route = createFileRoute("/app/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge base — KaliGan AI" },
      { name: "description", content: "Knowledge base in your KaliGan AI workspace." },
      { property: "og:title", content: "Knowledge base — KaliGan AI" },
      { property: "og:description", content: "Knowledge base in your KaliGan AI workspace." },
    ],
  }),
  component: Knowledge,
});
