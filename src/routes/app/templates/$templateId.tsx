import { createFileRoute } from "@tanstack/react-router";
import TemplateFlow from "@/pages/TemplateFlow";

export const Route = createFileRoute("/app/templates/$templateId")({
  head: () => ({
    meta: [
      { title: "Template setup — KaliGan AI" },
      { name: "description", content: "Template setup in your KaliGan AI workspace." },
      { property: "og:title", content: "Template setup — KaliGan AI" },
      { property: "og:description", content: "Template setup in your KaliGan AI workspace." },
    ],
  }),
  component: TemplateFlow,
});
