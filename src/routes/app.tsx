import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import AppShell from "../components/AppShell";
import { PrivateRoute } from "../components/AuthGuards";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname.startsWith("/app/onboarding");
  return <PrivateRoute>{bare ? <Outlet /> : <AppShell />}</PrivateRoute>;
}
