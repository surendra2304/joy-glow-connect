import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../lib/auth";
import { Loading } from "./grok";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || loading) {
    return <Loading fullScreen label="Verifying session" subtitle="Please wait a moment" />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || loading) {
    return <Loading fullScreen label="Loading KaliGan AI" subtitle="Please wait a moment" />;
  }
  if (user) {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
}
