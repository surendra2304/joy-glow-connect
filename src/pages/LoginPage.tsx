import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogoLockup } from "../components/LogoLockup";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-gradient">
      <div className="mx-auto grid min-h-screen w-full max-w-md content-center justify-items-center px-5 py-12">
        <Link to="/" aria-label="KaliGanAI home" className="flex w-fit items-center justify-center justify-self-center">
          <LogoLockup
            className="justify-center"
            markClassName="h-10 w-10"
            textClassName="text-xl font-semibold tracking-[-0.05em]"
          />
        </Link>
        <h1 className="mt-6 w-full text-center text-3xl">Welcome back.</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to manage your AI employees and workflows.
        </p>
        <form onSubmit={handleSubmit} className="card-surface mt-8 w-full space-y-4 p-6 border border-border rounded-2xl bg-background shadow-sm">
          {error && <div className="text-red-500 text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">{error}</div>}
          <label className="block text-xs font-medium">
            Work email
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="block text-xs font-medium">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black text-white py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground">
          New to KaliGanAI?{" "}
          <Link to="/signup" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
