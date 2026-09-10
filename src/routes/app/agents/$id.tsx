import { createFileRoute } from "@tanstack/react-router";
import EmployeeDetail from "../pages/EmployeeDetail";

export const Route = createFileRoute("/app/agents/$id")({
  head: () => ({
    meta: [
      { title: "Agent details — KaliGan AI" },
      { name: "description", content: "Agent details in your KaliGan AI workspace." },
      { property: "og:title", content: "Agent details — KaliGan AI" },
      { property: "og:description", content: "Agent details in your KaliGan AI workspace." },
    ],
  }),
  component: EmployeeDetail,
});
