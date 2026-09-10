import { createFileRoute } from "@tanstack/react-router";
import Templates from "@/pages/Templates";

export const Route = createFileRoute("/app/templates/")({
  head: () => ({
    meta: [
      { title: "AI Employee Marketplace — KaliGan AI" },
      { name: "description", content: "Discover verified AI employees for sales, support, scheduling, and operations." },
      { property: "og:title", content: "AI Employee Marketplace — KaliGan AI" },
      { property: "og:description", content: "Discover verified AI employees for sales, support, scheduling, and operations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Templates,
});
