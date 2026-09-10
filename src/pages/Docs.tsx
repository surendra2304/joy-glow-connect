import { useState } from "react";
import { GPageHeader, GSectionCard, GCopyButton } from "../components/grok";
import * as I from "../components/icons";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";

const platforms = ["HTML", "React", "Next.js", "WordPress", "Shopify"];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="g-mono text-[11.5px] leading-relaxed my-2 border rounded-grok px-3.5 py-3 overflow-x-auto select-all"
      style={{ borderColor: "var(--g-border)", background: "var(--g-surface)" }}>
      {children}
    </pre>
  );
}

export default function Docs() {
  const { workspace } = useAuth();
  const [activeTab, setActiveTab] = useState<"widget" | "knowledge" | "chat" | "voice">("widget");
  const [plat, setPlat] = useState("WordPress");


  const [verify, setVerify] = useState<"idle" | "checking" | "ok">("idle");

  const snippet = `<script src="${window.location.origin}/w.js" data-key="${workspace?.publicKey || ""}"></script>`;

  const doVerify = async () => {
    setVerify("checking");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await api.post("/widget/verify");
      if (res && res.installed) {
        setVerify("ok");
      } else {
        setVerify("idle");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setVerify("idle");
    }
  };

  const navItems = [
    { id: "widget" as const, label: "Widget installation", icon: <I.Code width={14} height={14} /> },
    { id: "knowledge" as const, label: "Knowledge base setup", icon: <I.Book width={14} height={14} /> },
    { id: "chat" as const, label: "Chat employee config", icon: <I.Bot width={14} height={14} /> },
    { id: "voice" as const, label: "Voice & Twilio (BYON)", icon: <I.Mic width={14} height={14} /> },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-none mx-auto min-h-[calc(100vh-2.5rem)]">
      <GPageHeader
        title="Documentation"
        description="Learn how to install, configure and customize your AI employees in minutes."
      />

      <div className="flex flex-col md:flex-row gap-8 items-start max-w-[840px]">
        <aside className="w-full md:w-[196px] shrink-0 g-card p-2.5 flex flex-row md:flex-col gap-0.5 select-none flex-wrap">
          <span className="g-label-xs px-2.5 pb-2 pt-1 hidden md:block">Guides & setup</span>
          {navItems.map((it) => (
            <button
              key={it.id}
              onClick={() => setActiveTab(it.id)}
              className={`g-nav-item ${activeTab === it.id ? "g-nav-item-active" : ""}`}
            >
              <span className="shrink-0 w-[18px] h-[18px] grid place-items-center">{it.icon}</span>
              <span className="flex-1 leading-none whitespace-nowrap">{it.label}</span>
            </button>
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          {activeTab === "widget" && (
            <GSectionCard>
              <div className="p-6">
                <h2 className="text-[18px] font-bold mb-1">Widget installation code</h2>
                <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--g-muted-foreground)" }}>
                  Get your AI live on your website in under 5 minutes. Copy the code below and insert it into your site pages.
                </p>

                <div className="flex items-center gap-3 mb-6 max-w-xl">
                  {["Verify site", "Get code", "Install", "Verify"].map((s, i) => (
                    <span key={s} className="flex items-center gap-2 shrink-0">
                      <span className="w-4 h-4 rounded-full grid place-items-center g-mono text-[9px]"
                        style={{ background: "var(--g-foreground)", color: "var(--g-background)" }}>
                        {i + 1}
                      </span>
                      <span className="g-label-xs">{s}</span>
                      {i < 3 && <span style={{ color: "var(--g-muted-foreground)" }}>→</span>}
                    </span>
                  ))}
                </div>

                <span className="g-label-xs block mb-1.5">Your install snippet</span>
                <div className="flex items-stretch gap-2 mb-2">
                  <code className="flex-1 g-mono text-[12px] border rounded-grok px-4 py-3 overflow-x-auto select-all leading-relaxed"
                    style={{ borderColor: "var(--g-border)", background: "var(--g-surface)" }}>
                    {snippet}
                  </code>
                  <GCopyButton text={snippet} className="h-[36px] px-4 shadow-xs" />
                </div>
                <p className="text-[11.5px] leading-relaxed mb-6" style={{ color: "var(--g-muted-foreground)" }}>
                  Paste this snippet just before the closing <code className="g-mono border rounded-[2px] px-1" style={{ borderColor: "var(--g-border)" }}>&lt;/body&gt;</code> tag.
                </p>

                <span className="g-label-xs block mb-2">Platform instructions</span>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {platforms.map((p) => (
                    <button key={p} onClick={() => setPlat(p)} className={`g-pill ${plat === p ? "g-pill-solid" : ""}`}>
                      {p}
                    </button>
                  ))}
                </div>

                <div className="border rounded-grok p-4 text-[13px] leading-relaxed mb-6"
                  style={{ borderColor: "var(--g-border)", background: "var(--g-surface)" }}>
                  {plat === "HTML" && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Generic HTML integration</span>
                      <span style={{ color: "var(--g-muted-foreground)" }}>
                        Paste the script snippet at the bottom of your root HTML file (usually <code className="g-mono">index.html</code>), right above the closing body tag. It loads asynchronously and initializes the chat bubble.
                      </span>
                    </div>
                  )}
                  {plat === "React" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-medium">React hook integration</span>
                      <span style={{ color: "var(--g-muted-foreground)" }}>Run this in your app root or inside a <code className="g-mono">useEffect</code>:</span>
                      <CodeBlock>{`useEffect(() => {
  const script = document.createElement('script');
  script.src = '${window.location.origin}/w.js';
  script.setAttribute('data-key', '${workspace?.publicKey || ""}');
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);`}</CodeBlock>
                    </div>
                  )}
                  {plat === "Next.js" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-medium">Next.js Script component</span>
                      <span style={{ color: "var(--g-muted-foreground)" }}>Import the <code className="g-mono">{'<Script>'}</code> module and place it in your root layout:</span>
                      <CodeBlock>{`import Script from 'next/script';

export default function RootLayout() {
  return (
    <>
      <Script 
        src="${window.location.origin}/w.js" 
        data-key="${workspace?.publicKey || ""}"
        strategy="lazyOnload"
      />
    </>
  );
}`}</CodeBlock>
                    </div>
                  )}
                  {plat === "WordPress" && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">WordPress theme editor</span>
                      <ol className="list-decimal ml-4 space-y-1 mt-1" style={{ color: "var(--g-muted-foreground)" }}>
                        <li>Log in to your WordPress dashboard.</li>
                        <li>Navigate to <strong>Appearance → Theme File Editor</strong>.</li>
                        <li>Open your <strong>footer.php</strong> template.</li>
                        <li>Paste the snippet just above <code className="g-mono">&lt;/body&gt;</code> and save.</li>
                      </ol>
                    </div>
                  )}
                  {plat === "Shopify" && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Shopify theme.liquid</span>
                      <ol className="list-decimal ml-4 space-y-1 mt-1" style={{ color: "var(--g-muted-foreground)" }}>
                        <li>Go to <strong>Online Store → Themes</strong> in your Shopify admin.</li>
                        <li>Click the three dots → <strong>Edit code</strong>.</li>
                        <li>Open <strong>Layout / theme.liquid</strong>.</li>
                        <li>Paste the snippet above <code className="g-mono">&lt;/body&gt;</code> and save.</li>
                      </ol>
                    </div>
                  )}
                </div>

                <div className="border-t pt-5 flex items-center gap-4" style={{ borderColor: "var(--g-border)" }}>
                  <button onClick={doVerify} className="g-btn">
                    {verify === "checking" ? "Checking…" : verify === "ok" ? "Installed" : "Verify installation"}
                  </button>
                  {verify === "ok" && (
                    <span className="text-[12.5px]">
                      ✓ Widget active · website connected · AI employee ready
                    </span>
                  )}
                  {verify === "checking" && (
                    <span className="text-[12.5px] animate-pulse" style={{ color: "var(--g-muted-foreground)" }}>
                      Looking for the widget on your site…
                    </span>
                  )}
                  {verify === "idle" && (
                    <span className="text-[12.5px]" style={{ color: "var(--g-muted-foreground)" }}>
                      Click to check whether the widget is live on your website.
                    </span>
                  )}
                </div>
              </div>
            </GSectionCard>
          )}

          {activeTab === "knowledge" && (
            <GSectionCard>
              <div className="p-6">
                <h2 className="text-[18px] font-bold mb-1">Grounding &amp; Knowledge Base</h2>
                <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--g-muted-foreground)" }}>
                  How your AI employee acquires knowledge and answers factually without hallucinating.
                </p>
                <div className="flex flex-col gap-5 text-[13px] leading-relaxed">
                  <div>
                    <h3 className="font-medium mb-1">1. Document uploads</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Upload PDF or plain-text files on the Knowledge page. Ingestion parses text on the fly,
                      splits it into overlapping semantic chunks and generates vector embeddings.
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">2. Website crawling</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Submit URLs to crawl pages instantly — public HTML text is parsed, indexed and attached to your workspace.
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">3. Strict grounding (anti-hallucination)</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Every visitor prompt runs a vector similarity search via pgvector against your chunks.
                      Below the safety threshold (score &gt; 0.35) the AI declines to answer from general
                      knowledge and starts the lead-capture sequence instead.
                    </span>
                  </div>
                </div>
              </div>
            </GSectionCard>
          )}

          {activeTab === "chat" && (
            <GSectionCard>
              <div className="p-6">
                <h2 className="text-[18px] font-bold mb-1">Chat employee &amp; lead capture</h2>
                <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--g-muted-foreground)" }}>
                  Configure identity, capture rules and conversion criteria.
                </p>
                <div className="flex flex-col gap-5 text-[13px] leading-relaxed">
                  <div>
                    <h3 className="font-medium mb-1">1. Identity and tone</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Customize the name, greeting and persona of your employee under Persona & Prompt.
                      Strict role directives (e.g. "act as a sales executive for Acme") guide conversation style.
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">2. Lead capture fields</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Pick the fields to collect — name, email, phone. The employee steers the conversation
                      toward capturing them once the visitor shows buying intent.
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">3. Automated lead scoring</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Captured contacts are scored Hot / Warm / Cold from buying signals in the transcript
                      and routed straight to your Leads page.
                    </span>
                  </div>
                </div>
              </div>
            </GSectionCard>
          )}

          {activeTab === "voice" && (
            <GSectionCard>
              <div className="p-6">
                <h2 className="text-[18px] font-bold mb-1">Connecting your Twilio number (BYON)</h2>
                <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--g-muted-foreground)" }}>
                  Connect your own Twilio phone numbers so the same grounded employee answers calls.
                </p>
                <div className="flex flex-col gap-5 text-[13px] leading-relaxed">
                  <div>
                    <h3 className="font-medium mb-1">Step 1 — webhook URL</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Each voice employee generates a unique webhook URL, available under its Channels tab:
                    </span>
                    <CodeBlock>{`${window.location.origin}/api/v1/telephony/twilio/incoming/agent_${workspace?.id?.substring(0, 8) || "workspace"}`}</CodeBlock>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Step 2 — Twilio console</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      In Twilio → Phone Numbers → your number, paste the webhook URL into
                      <strong> "A call comes in"</strong> and select <strong>HTTP POST</strong>.
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Step 3 — verification</h3>
                    <span style={{ color: "var(--g-muted-foreground)" }}>
                      Click Verify on the employee's Channels tab and make a test call — the number links instantly.
                    </span>
                  </div>
                </div>
              </div>
            </GSectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
