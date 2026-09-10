import { createFileRoute } from "@tanstack/react-router";
import { Numbers } from "@/pages/Numbers";

export const Route = createFileRoute("/app/numbers")({
  head: () => ({ meta: [
    { title: "Phone Numbers — KaliGan AI" },
    { name: "description", content: "Provision and manage AI employee phone lines." },
    { property: "og:title", content: "Phone Numbers — KaliGan AI" },
    { property: "og:description", content: "Provision and manage AI employee phone lines." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Numbers,
});
