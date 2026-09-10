import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "../pages/Settings";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — KaliGan AI" }] }),
  component: Settings,
});
