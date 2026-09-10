import { createFileRoute } from "@tanstack/react-router";
import Analytics from "../pages/Analytics";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — KaliGan AI" },
      { name: "description", content: "Analytics in your KaliGan AI workspace." },
      { property: "og:title", content: "Analytics — KaliGan AI" },
      { property: "og:description", content: "Analytics in your KaliGan AI workspace." },
    ],
  }),
  component: Analytics,
});
