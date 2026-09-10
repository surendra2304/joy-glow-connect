import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../pages/Dashboard";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Workforce dashboard — KaliGan AI" },
      { name: "description", content: "Workforce dashboard in your KaliGan AI workspace." },
      { property: "og:title", content: "Workforce dashboard — KaliGan AI" },
      { property: "og:description", content: "Workforce dashboard in your KaliGan AI workspace." },
    ],
  }),
  component: Dashboard,
});
