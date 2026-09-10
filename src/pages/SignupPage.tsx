import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogoLockup } from "../components/LogoLockup";
import { useAuth } from "../lib/auth";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(company, "", email, password); // empty website URL
      setDone(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-gradient">
      <div className="mx-auto grid min-h-screen w-full max-w-md content-center justify-items-center px-5 py-6">
        <Link to="/" aria-label="KaliGanAI home" className="flex w-fit items-center justify-center justify-self-center">
          <LogoLockup
            className="justify-center"
            markClassName="h-9 w-9"
            textClassName="text-xl font-semibold tracking-[-0.05em]"
          />
        </Link>
        <h1 className="mt-4 w-full text-center text-2xl sm:text-3xl">Hire your first AI employee.</h1>
        <p className="mt-1.5 text-center text-[13px] text-muted-foreground">
          Start with one workflow and expand as your team grows.
        </p>
        <form onSubmit={handleSubmit} className="card-surface mt-5 w-full space-y-2.5 p-5 border border-border rounded-2xl bg-background shadow-sm">
          {error && <div className="text-red-500 text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">{error}</div>}
          
          <label className="block text-xs font-medium">
            Full name
            <input
              required
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Surendra Kumar"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="block text-xs font-medium">
            Work email
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="block text-xs font-medium">
            Company
            <input
              required
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Apex Corp"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/20"
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
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </label>
          
          <button
            type="submit"
            disabled={loading || done}
            className="w-full rounded-full bg-black text-white py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
          
          {done && (
            <p className="rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground mt-2">
              Thanks! Redirecting to login...
            </p>
          )}
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
