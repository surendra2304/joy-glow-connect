import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/pages/LoginPage";
import { PublicRoute } from "../components/AuthGuards";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — KaliGan AI" },
      { name: "description", content: "Sign in to your KaliGan AI workspace." },
      { property: "og:title", content: "Sign in — KaliGan AI" },
      { property: "og:description", content: "Sign in to your KaliGan AI workspace." },
    ],
  }),
  component: () => (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  ),
});
