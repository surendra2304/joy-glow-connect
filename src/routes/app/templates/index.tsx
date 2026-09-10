import { createFileRoute } from "@tanstack/react-router";
import Templates from "@/pages/Templates";

export const Route = createFileRoute("/app/templates/")({
  head: () => ({
    meta: [
      { title: "Templates — KaliGan AI" },
      { name: "description", content: "Templates in your KaliGan AI workspace." },
      { property: "og:title", content: "Templates — KaliGan AI" },
      { property: "og:description", content: "Templates in your KaliGan AI workspace." },
    ],
  }),
  component: Templates,
});
