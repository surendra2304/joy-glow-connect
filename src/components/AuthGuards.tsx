import type { ReactNode } from "react";

// The app has no login screen — these guards simply render their children.
export function PrivateRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
