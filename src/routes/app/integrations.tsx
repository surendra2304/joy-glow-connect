import { createFileRoute } from "@tanstack/react-router";
import Connectors from "@/pages/Connectors";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — KaliGan AI" },
      { name: "description", content: "Integrations in your KaliGan AI workspace." },
      { property: "og:title", content: "Integrations — KaliGan AI" },
      { property: "og:description", content: "Integrations in your KaliGan AI workspace." },
    ],
  }),
  component: Connectors,
});
