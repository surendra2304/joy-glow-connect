import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "@/pages/SignupPage";
import { PublicRoute } from "../components/AuthGuards";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — KaliGan AI" },
      { name: "description", content: "Create your KaliGan AI workspace." },
      { property: "og:title", content: "Create account — KaliGan AI" },
      { property: "og:description", content: "Create your KaliGan AI workspace." },
    ],
  }),
  component: () => (
    <PublicRoute>
      <SignupPage />
    </PublicRoute>
  ),
});
