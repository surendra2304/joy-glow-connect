import { createFileRoute } from "@tanstack/react-router";
import Docs from "@/pages/Docs";

export const Route = createFileRoute("/app/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — KaliGan AI" },
      { name: "description", content: "Documentation in your KaliGan AI workspace." },
      { property: "og:title", content: "Documentation — KaliGan AI" },
      { property: "og:description", content: "Documentation in your KaliGan AI workspace." },
    ],
  }),
  component: Docs,
});
