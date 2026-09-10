import { createFileRoute } from "@tanstack/react-router";
import { Numbers } from "../pages/Numbers";

export const Route = createFileRoute("/app/numbers")({
  head: () => ({ meta: [{ title: "Phone numbers — KaliGan AI" }] }),
  component: Numbers,
});
