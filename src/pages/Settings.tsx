import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GEyebrow, GSectionCard, GStat, GStatRow, GSubNav, GField, GSpinner, GCopyButton } from "../components/grok";
import * as I from "../components/icons";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const SETTINGS_TABS = [
  { id: "workspace", label: "General & Workspace" },
  { id: "billing", label: "Billing & Plan" },
  { id: "profile", label: "Profile & Account" },
  { id: "security", label: "Security & Passwords" },
  { id: "developer", label: "API & Developer" },
];



function UsageBar({ label, value, limit, unit = "" }: { label: string; value: number; limit: number; unit?: string }) {
  const pct = limit === Infinity ? 0 : Math.min(100, Math.round((value / limit) * 100));
  const isNearLimit = pct >= 85;

  return (
    <div className="border rounded-grok p-4 bg-[var(--g-background)] transition hover:border-[var(--g-border-strong)]" style={{ borderColor: "var(--g-border)" }}>
      <div className="flex justify-between items-center g-label-xs">
        <span className="font-medium text-[12.5px]" style={{ color: "var(--g-foreground)" }}>{label}</span>
        <span className="g-mono text-[11.5px]" style={{ color: isNearLimit ? "#e11d48" : "var(--g-muted-foreground)" }}>
          {value.toLocaleString()} {unit} / {limit === Infinity ? "∞" : `${limit.toLocaleString()} ${unit}`}
        </span>
      </div>
      {limit !== Infinity && (
        <div className="w-full h-[4px] mt-3 rounded-full overflow-hidden" style={{ background: "var(--g-surface-2)" }}>
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${pct}%`,
              background: isNearLimit ? "#e11d48" : "var(--g-foreground)",
            }}
          />
        </div>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="g-mono text-[10.5px]" style={{ color: "var(--g-muted-foreground)" }}>
          {limit === Infinity ? "Unlimited tier" : `${pct}% consumed`}
        </span>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  blurb,
  features,
  current,
  action,
  onAction,
  busy,
  primary,
}: {
  name: string;
  price: string;
  blurb: string;
  features: { text: string; included: boolean }[];
  current: boolean;
  action: string;
  onAction: () => void;
  busy: boolean;
  primary?: boolean;
}) {
  return (
    <div
      className={`border rounded-grok p-5 flex flex-col justify-between transition relative ${
        current
          ? "border-[var(--g-foreground)] bg-[var(--g-surface)] shadow-sm"
          : "border-[var(--g-border)] hover:border-[var(--g-border-strong)] bg-[var(--g-background)]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-[16px] font-semibold tracking-tight">{name}</h4>
          {current ? (
            <span className="g-pill g-pill-solid text-[10.5px]">Current plan</span>
          ) : primary ? (
            <span className="g-pill g-pill-strong text-[10.5px]">Recommended</span>
          ) : null}
        </div>
        <div className="text-[12px] mt-1" style={{ color: "var(--g-muted-foreground)" }}>
          {blurb}
        </div>
        <div className="mt-4 pb-4 border-b flex items-baseline gap-1" style={{ borderColor: "var(--g-border-light)" }}>
          <span className="text-[28px] font-semibold g-num tracking-tight">{price}</span>
          {price !== "Custom" && <span className="text-[12px]" style={{ color: "var(--g-muted-foreground)" }}>/month</span>}
        </div>
        <ul className="mt-4 space-y-2 text-[12.5px]">
          {features.map((f) => (
            <li key={f.text} className="flex items-start gap-2.5" style={{ color: f.included ? "var(--g-foreground)" : "var(--g-muted-foreground)" }}>
              <span className="g-mono text-[13px] font-medium" style={{ color: f.included ? "var(--g-foreground)" : "var(--g-muted-foreground)" }}>
                {f.included ? "+" : "–"}
              </span>
              <span className={f.included ? "" : "line-through opacity-60"}>{f.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className={`${current ? "g-btn-2 opacity-80" : primary ? "g-btn" : "g-btn-2"} w-full mt-6`}
        onClick={onAction}
        disabled={busy || current}
      >
        {current ? "Current plan" : action}
      </button>
    </div>
  );
}

export function Settings() {
  const { user, workspace, refreshSession } = useAuth();
  const [tab, setTab] = useState("workspace");

  const [workspaceName, setWorkspaceName] = useState(workspace?.name || "");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#0E7A5F");

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const [usageData, setUsageData] = useState<any | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    if (workspace) {
      setWorkspaceName(workspace.name);
    }
    if (user) {
      setProfileName(user.name || "");
      setProfileEmail(user.email);
    }
  }, [user, workspace]);

  const fetchUsage = useCallback(async () => {
    setLoadingUsage(true);
    try {
      const data = await api.get("/billing/usage");
      setUsageData(data);
    } catch (err) {
      console.error("Failed to load usage details", err);
    } finally {
      setLoadingUsage(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "billing") {
      fetchUsage();
    }
  }, [tab, fetchUsage]);

  const handleUpgrade = async (plan: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post("/billing/checkout", {
        plan,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      });
      if (res.isMock) {
        const mockRes = await api.post("/billing/mock-checkout", { plan });
        if (mockRes.success) {
          setMessage({ text: `Successfully updated to ${plan} plan!`, success: true });
          await refreshSession();
          await fetchUsage();
        }
      } else {
        window.location.href = res.url;
      }
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ text: error.message || "Checkout failed", success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post("/billing/portal", { returnUrl: window.location.href });
      if (res.isMock) {
        alert("Billing portal is in mock mode because Stripe is not configured.");
      } else {
        window.location.href = res.url;
      }
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ text: error.message || "Failed to load billing portal", success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.patch("/workspace", {
        name: workspaceName,
        websiteUrl: websiteUrl || undefined,
        brandColor,
      });
      await refreshSession();
      setMessage({ text: "Workspace settings updated successfully.", success: true });
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ text: error.message || "Failed to update workspace", success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.patch("/auth/me", { name: profileName, email: profileEmail });
      await refreshSession();
      setMessage({ text: "Profile information saved.", success: true });
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ text: error.message || "Failed to update profile", success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ text: "New password must be at least 8 characters long.", success: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match.", success: false });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ text: "Password changed successfully.", success: true });
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ text: error.message || "Failed to change password", success: false });
    } finally {
      setLoading(false);
    }
  };

  const defaultLimits = {
    chatMessages: 500,
    voiceMinutes: 100,
    agents: 2,
  };
  const chatLimit = usageData?.limits?.chatMessages ?? defaultLimits.chatMessages;
  const voiceLimit = usageData?.limits?.voiceMinutes ?? defaultLimits.voiceMinutes;
  const agentLimit = usageData?.limits?.agents ?? defaultLimits.agents;
  const chatUsage = usageData?.usage?.chatMessages ?? 0;
  const voiceUsage = usageData?.usage?.voiceMinutes ?? 0;
  const agentUsage = usageData?.usage?.agents ?? 0;

  const currentPlan = usageData?.plan || workspace?.plan || "starter";
  const userInitials = (profileName || user?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="mb-6 fadeup">
        <GEyebrow parts={["Infrastructure", "Configuration & Preferences", `${currentPlan} tier`]} />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="g-serif text-[34px] leading-[1.1]">Settings</h1>
            </div>
            <p className="text-[13.5px] mt-2 max-w-2xl leading-relaxed" style={{ color: "var(--g-muted-foreground)" }}>
              Manage your workspace identity, subscription & usage quotas, security keys, and team credentials.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            {message && (
              <span className={`g-pill ${message.success ? "g-pill-solid" : "g-pill-strong text-red-500"}`}>
                {message.success ? "✓" : "⚠"} {message.text}
              </span>
            )}
            <Link to="/app/docs" className="g-btn-2">
              <I.Book width={13} height={13} /> Documentation
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-8 items-start">
        {/* Left Sub-Navigation Rail */}
        <aside className="lg:sticky lg:top-[76px]">
          <GSubNav
            items={SETTINGS_TABS}
            active={tab}
            onSelect={(t) => {
              setTab(t);
              setMessage(null);
            }}
          />
        </aside>

        {/* Right Content Panels */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ================= WORKSPACE TAB ================= */}
              {tab === "workspace" && (
                <div className="space-y-6">
                  <GSectionCard
                    title="Workspace Identity & Branding"
                    description="Configure your company name, website origin, and customized brand aesthetic."
                  >
                    <form onSubmit={handleSaveWorkspace} className="p-6 space-y-5 max-w-xl">
                      <GField label="Company name" hint="Appears on client communications, widget headers, and invoices.">
                        <input
                          className="g-input"
                          value={workspaceName}
                          onChange={(e) => setWorkspaceName(e.target.value)}
                          placeholder="e.g. Acme Corp"
                          required
                        />
                      </GField>

                      <GField label="Website URL" hint="Used for domain verification and knowledge base crawler auto-discovery.">
                        <input
                          className="g-input"
                          placeholder="https://acme.com"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                      </GField>

                      <GField label="Brand color" hint="Theme accent for the customer-facing chat widget and buttons.">
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            className="w-10 h-10 rounded-grok border cursor-pointer p-1 bg-transparent shrink-0"
                            style={{ borderColor: "var(--g-border)" }}
                            value={brandColor.startsWith("#") && brandColor.length === 7 ? brandColor : "#0E7A5F"}
                            onChange={(e) => setBrandColor(e.target.value)}
                          />
                          <input
                            className="g-input g-mono max-w-[160px]"
                            value={brandColor}
                            onChange={(e) => setBrandColor(e.target.value)}
                            required
                          />
                          <div
                            className="px-3 py-1.5 rounded-full text-[12px] font-medium text-[#ffffff] shrink-0 shadow-sm"
                            style={{ background: brandColor }}
                          >
                            Widget Live Preview
                          </div>
                        </div>
                      </GField>

                      <div className="pt-2">
                        <button type="submit" className="g-btn" disabled={loading}>
                          {loading ? "Saving changes…" : "Save changes"}
                        </button>
                      </div>
                    </form>
                  </GSectionCard>

                  <GSectionCard
                    title="Workspace Credentials & Keys"
                    description="Unique identifiers used to link widgets and telephony integrations."
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border rounded-grok bg-[var(--g-surface)]" style={{ borderColor: "var(--g-border)" }}>
                        <div>
                          <div className="g-label-xs">Workspace Public Key</div>
                          <div className="g-mono text-[13px] mt-1 font-medium select-all">{workspace?.publicKey || "ws_..."}</div>
                        </div>
                        {workspace?.publicKey && <GCopyButton text={workspace.publicKey} />}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border rounded-grok bg-[var(--g-surface)]" style={{ borderColor: "var(--g-border)" }}>
                        <div>
                          <div className="g-label-xs">Workspace ID</div>
                          <div className="g-mono text-[12.5px] mt-1 text-[var(--g-muted-foreground)] select-all">{workspace?.id || "—"}</div>
                        </div>
                        {workspace?.id && <GCopyButton text={workspace.id} />}
                      </div>
                    </div>
                  </GSectionCard>
                </div>
              )}

              {/* ================= BILLING & PLAN TAB ================= */}
              {tab === "billing" && (
                <div className="space-y-6">
                  {loadingUsage && !usageData ? (
                    <GSpinner />
                  ) : (
                    <>
                      <GStatRow className="grid-cols-1 sm:grid-cols-3">
                        <GStat
                          label="Current tier"
                          value={<span className="capitalize">{currentPlan}</span>}
                          sub={usageData?.cycleStart ? `Cycle started ${new Date(usageData.cycleStart).toLocaleDateString("en-GB")}` : "Billed monthly"}
                        />
                        <GStat
                          label="Chat messages"
                          value={chatUsage.toLocaleString()}
                          sub={chatLimit === Infinity ? "Unlimited messages" : `Limit: ${chatLimit.toLocaleString()}`}
                        />
                        <GStat
                          label="Voice telephony"
                          value={`${voiceUsage} min`}
                          sub={voiceLimit === Infinity ? "Unlimited minutes" : `Limit: ${voiceLimit} minutes`}
                        />
                      </GStatRow>

                      <GSectionCard
                        title="Resource Consumption"
                        description="Real-time quota monitoring for your current billing period."
                        action={
                          currentPlan !== "starter" ? (
                            <button className="g-btn-2" onClick={handleManageBilling} disabled={loading}>
                              Manage billing portal
                            </button>
                          ) : null
                        }
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <UsageBar
                              label="Chat Conversations"
                              value={chatUsage}
                              limit={chatLimit}
                              unit="msgs"
                            />
                            <UsageBar
                              label="Voice Minutes"
                              value={voiceUsage}
                              limit={voiceLimit}
                              unit="min"
                            />
                            <UsageBar
                              label="Active Employees"
                              value={agentUsage}
                              limit={agentLimit}
                              unit="agents"
                            />
                          </div>
                        </div>
                      </GSectionCard>

                      <GSectionCard
                        title="Available Subscription Plans"
                        description="Upgrade or modify your organization tier at any time."
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <PlanCard
                              name="Starter"
                              price="$49"
                              blurb="Ideal for small businesses launching their first AI employees"
                              features={[
                                { text: "1 chat + 1 voice employee", included: true },
                                { text: "500 conversations /mo", included: true },
                                { text: "100 voice minutes /mo", included: true },
                                { text: "Knowledge Base RAG indexing", included: true },
                                { text: "BYON telephony connectivity", included: false },
                              ]}
                              current={currentPlan === "starter"}
                              action="Downgrade to Starter"
                              onAction={() => handleUpgrade("starter")}
                              busy={loading}
                            />
                            <PlanCard
                              name="Growth"
                              price="$149"
                              blurb="For scaling agencies & consultancies requiring high capacity"
                              primary
                              features={[
                                { text: "3 chat + 3 voice employees", included: true },
                                { text: "5,000 conversations /mo", included: true },
                                { text: "1,000 voice minutes /mo", included: true },
                                { text: "Bring-your-own-number (BYON)", included: true },
                                { text: "Priority FastEmbed & LLM latency", included: true },
                              ]}
                              current={currentPlan === "growth"}
                              action="Upgrade to Growth"
                              onAction={() => handleUpgrade("growth")}
                              busy={loading}
                            />
                            <PlanCard
                              name="Enterprise"
                              price="Custom"
                              blurb="High-volume bespoke deployment with custom SLAs"
                              features={[
                                { text: "Unlimited AI employees", included: true },
                                { text: "Unlimited conversations & voice", included: true },
                                { text: "Dedicated isolated Postgres instance", included: true },
                                { text: "White-labeling & custom subdomains", included: true },
                                { text: "24/7 dedicated engineering support", included: true },
                              ]}
                              current={currentPlan === "enterprise"}
                              action="Contact Sales"
                              onAction={() => handleUpgrade("enterprise")}
                              busy={loading}
                            />
                          </div>
                        </div>
                      </GSectionCard>
                    </>
                  )}
                </div>
              )}

              {/* ================= PROFILE & ACCOUNT TAB ================= */}
              {tab === "profile" && (
                <div className="space-y-6">
                  <GSectionCard
                    title="User Profile"
                    description="Personal information and account credentials associated with your workspace."
                  >
                    <form onSubmit={handleSaveProfile} className="p-6 space-y-5 max-w-xl">
                      <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: "var(--g-border-light)" }}>
                        <div
                          className="w-14 h-14 rounded-full grid place-items-center font-semibold text-[17px] border shadow-sm"
                          style={{
                            background: "var(--g-secondary)",
                            borderColor: "var(--g-border)",
                            color: "var(--g-foreground)",
                          }}
                        >
                          {userInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[15px]">{profileName || "User"}</span>
                            <span className="g-pill g-pill-solid text-[10.5px] uppercase tracking-wider">{user?.role || "owner"}</span>
                          </div>
                          <div className="g-mono text-[12px] mt-0.5" style={{ color: "var(--g-muted-foreground)" }}>
                            {profileEmail}
                          </div>
                        </div>
                      </div>

                      <GField label="Full name">
                        <input
                          className="g-input"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Your Name"
                          required
                        />
                      </GField>

                      <GField label="Email address" hint="Used for authentication, notifications, and password recovery.">
                        <input
                          type="email"
                          className="g-input g-mono"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          required
                        />
                      </GField>

                      <div className="pt-2">
                        <button type="submit" className="g-btn" disabled={loading}>
                          {loading ? "Saving profile…" : "Save profile changes"}
                        </button>
                      </div>
                    </form>
                  </GSectionCard>
                </div>
              )}

              {/* ================= SECURITY & PASSWORDS TAB ================= */}
              {tab === "security" && (
                <div className="space-y-6">
                  <GSectionCard
                    title="Change Password"
                    description="Ensure your workspace account uses a strong and unique password."
                  >
                    <form onSubmit={handleChangePassword} className="p-6 space-y-5 max-w-xl">
                      <GField label="Current password">
                        <input
                          type="password"
                          className="g-input"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                        />
                      </GField>

                      <GField label="New password" hint="Must be at least 8 characters long.">
                        <input
                          type="password"
                          className="g-input"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                        />
                      </GField>

                      <GField label="Confirm new password">
                        <input
                          type="password"
                          className="g-input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                        />
                      </GField>

                      <div className="pt-2">
                        <button type="submit" className="g-btn" disabled={loading}>
                          {loading ? "Updating password…" : "Update password"}
                        </button>
                      </div>
                    </form>
                  </GSectionCard>
                </div>
              )}

              {/* ================= API & DEVELOPER TAB ================= */}
              {tab === "developer" && (
                <div className="space-y-6">
                  <GSectionCard
                    title="Website Chat Widget Snippet"
                    description="Embed your AI employees directly onto any webpage with a single script tag."
                  >
                    <div className="p-6 space-y-4">
                      <div className="relative">
                        <pre
                          className="p-4 rounded-grok g-mono text-[12px] overflow-x-auto leading-relaxed border"
                          style={{
                            background: "var(--g-surface)",
                            borderColor: "var(--g-border)",
                            color: "var(--g-foreground)",
                          }}
                        >
{`<!-- KaliGanAI Customer Widget Embed -->
<script
  src="${window.location.origin}/w.js"
  data-key="${workspace?.publicKey || "ws_your_workspace_key"}"
  async
></script>`}
                        </pre>
                        <div className="absolute top-3 right-3">
                          <GCopyButton
                            text={`<script src="${window.location.origin}/w.js" data-key="${workspace?.publicKey || "ws_your_workspace_key"}" async></script>`}
                          />
                        </div>
                      </div>
                      <p className="text-[12.5px]" style={{ color: "var(--g-muted-foreground)" }}>
                        Paste this code right before the closing <code className="g-mono text-[11.5px] px-1.5 py-0.5 rounded border">&lt;/body&gt;</code> tag on your website.
                      </p>
                    </div>
                  </GSectionCard>

                  <GSectionCard
                    title="Telephony & RAG Infrastructure"
                    description="Underlying engine configurations powering your workspace."
                  >
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-grok bg-[var(--g-surface)]" style={{ borderColor: "var(--g-border)" }}>
                        <div className="g-label-xs">Vector Embeddings</div>
                        <div className="text-[14px] font-medium mt-1">BAAI/bge-small-en-v1.5</div>
                        <div className="g-mono text-[11.5px] mt-1" style={{ color: "var(--g-muted-foreground)" }}>
                          384 dimensions · FastEmbed pgvector
                        </div>
                      </div>
                      <div className="p-4 border rounded-grok bg-[var(--g-surface)]" style={{ borderColor: "var(--g-border)" }}>
                        <div className="g-label-xs">Voice Gateway</div>
                        <div className="text-[14px] font-medium mt-1">Vobiz / Twilio Bi-Directional Bridge</div>
                        <div className="g-mono text-[11.5px] mt-1" style={{ color: "var(--g-muted-foreground)" }}>
                          WebSocket streaming · Ultra-low latency
                        </div>
                      </div>
                    </div>
                  </GSectionCard>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default Settings;

