import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "../components/grok";
import * as I from "../components/icons";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";



export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const labels = ["Teach", "Shape", "Meet", "Go live", "Live"];
  const [hasSources, setHasSources] = useState(false);
  const [agentName, setAgentName] = useState("Kali");
  const [agentPersona, setAgentPersona] = useState("Friendly");
  
  // Meet step preview state
  const [previewMsgs, setPreviewMsgs] = useState<{ role: string; content: string }[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [sending, setSending] = useState(false);

  const [verifyStatus, setVerifyStatus] = useState<"idle" | "checking" | "ok" | "failed">("idle");

  const handleVerify = async () => {
    setVerifyStatus("checking");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await api.post("/widget/verify");
      if (res && res.installed) {
        setVerifyStatus("ok");
      } else {
        setVerifyStatus("failed");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setVerifyStatus("failed");
    }
  };

  // Poll or check if the workspace has ready documents in Step 1
  useEffect(() => {
    if (step !== 1) return;

    let active = true;
    const checkDocuments = async () => {
      try {
        const docs = await api.get("/kb/documents");
        const hasReady = docs.some((d: any) => d.status === "ready");
        if (active) {
          setHasSources(hasReady);
        }
      } catch (err) {
        console.error("Failed to check onboarding KB status", err);
      }
    };

    checkDocuments();
    const interval = setInterval(checkDocuments, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [step]);

  // Set up preview messaging greeting
  useEffect(() => {
    if (step === 3) {
      setPreviewMsgs([
        { role: "agent", content: `Hi! I'm ${agentName} 👋 How can I help you?` },
      ]);
    }
  }, [step, agentName]);

  const handleSaveShape = async () => {
    try {
      // Find chat agent and patch it
      const data = await api.get("/agents?kind=chat");
      let agentId = "";
      if (data && data.length > 0) {
        agentId = data[0].id;
      } else {
        const newAgent = await api.post("/agents", {
          kind: "chat",
          name: agentName,
          persona: agentPersona,
        });
        agentId = newAgent.id;
      }
      await api.patch(`/agents/${agentId}`, {
        name: agentName,
        persona: agentPersona,
        greeting: `Hi! I'm ${agentName} 👋 How can I help you?`,
      });
      setStep(3);
    } catch (err) {
      alert("Failed to save agent profile shape: " + err);
    }
  };

  const handleSendOnboardingMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || sending) return;

    const userMessage = inputMsg.trim();
    setInputMsg("");
    setSending(true);

    const updatedMsgs = [...previewMsgs, { role: "visitor", content: userMessage }];
    setPreviewMsgs(updatedMsgs);

    try {
      const history = updatedMsgs.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Find chat agent to test preview
      const agents = await api.get("/agents?kind=chat");
      const agentId = agents[0]?.id;

      const res = await api.post("/chat/preview", {
        agentId,
        message: userMessage,
        history,
      });

      setPreviewMsgs((prev) => [...prev, { role: "agent", content: res.reply }]);
    } catch (err) {
      setPreviewMsgs((prev) => [
        ...prev,
        { role: "agent", content: "Couldn't retrieve response. Ensure KB has ready sources." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const { workspace } = useAuth();
  const publicKey = workspace?.publicKey || "ws_your_public_key";
  const widgetSnippet = `<script src="${window.location.origin}/w.js" data-key="${publicKey}"></script>`;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center justify-between mb-6 fadeup">
        <div className="flex gap-1.5">
          {labels.map((_, i) => (
            <span key={i} className={`h-1.5 w-12 rounded-full ${i < step ? "bg-emerald-600" : "bg-mint-300"}`} />
          ))}
        </div>
        <span className="text-[13px] font-semibold text-emerald-700">
          Step {step}/5 · {labels[step - 1]}
        </span>
      </div>

      <Card className="p-8 text-center fadeup">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-teal-400 grid place-items-center mx-auto mb-4">
          <I.Sparkle width={26} height={26} />
        </div>

        {/* STEP 1: Teach (Ingest documents) */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Teach your AI employee</h2>
            <p className="text-ink-muted max-w-md mx-auto text-sm">
              Upload documents, import FAQs, or paste web page URLs in the **Knowledge Base** section so your AI assistant can ground answers accurately.
            </p>
            <div className="mt-4 p-4 border border-dashed border-line rounded-lg bg-surface-2 max-w-sm mx-auto text-sm text-ink-muted">
              {hasSources ? (
                <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-success"></span> Ingestion complete! Click next to continue.
                </span>
              ) : (
                <span>
                  No ready documents detected yet. Please open the **Knowledge Base** in another tab and add a resource, then return here.
                </span>
              )}
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button className="btn border" onClick={() => navigate("/app/knowledge")}>
                Manage Knowledge Base
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={!hasSources}
                title={!hasSources ? "Please wait until at least one document is ready" : ""}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Shape */}
        {step === 2 && (
          <div className="space-y-4 max-w-md mx-auto text-left">
            <h2 className="font-display text-2xl font-bold text-center">Shape agent settings</h2>
            <p className="text-ink-muted text-center text-sm mb-4">
              Set the name and default conversational persona of your brand's AI representative.
            </p>
            <div>
              <label className="field-label font-semibold text-[13px] text-ink-muted">Agent name</label>
              <input
                className="input w-full mt-1 px-3 py-2 border border-line rounded-lg"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label font-semibold text-[13px] text-ink-muted block mt-3">Persona</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {["Friendly", "Professional", "Concise", "Enthusiastic"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAgentPersona(p)}
                    className={`border rounded-lg p-2.5 text-center text-xs font-semibold ${
                      agentPersona === p ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-line"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              <button className="btn border" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleSaveShape}>
                Save & Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Meet (Live Preview Chat) */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Meet your AI assistant</h2>
            <p className="text-ink-muted max-w-md mx-auto text-sm">
              Send a test message to converse with your AI agent based on the knowledge base context you provided.
            </p>
            
            <div className="bg-surface-2 border border-line rounded-xl p-4 mt-5 text-left text-[13.5px] max-h-[220px] overflow-y-auto space-y-2.5 max-w-lg mx-auto">
              {previewMsgs.map((m, idx) => (
                <div key={idx} className={m.role === "visitor" ? "text-right" : ""}>
                  <div
                    className={`px-3 py-2 rounded-xl border leading-relaxed inline-block ${
                      m.role === "visitor"
                        ? "bg-surface border-line text-ink text-left"
                        : "bg-emerald-50 border-mint-300 text-ink text-left"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && <div className="text-ink-muted italic text-xs">AI typing reply...</div>}
            </div>

            <form onSubmit={handleSendOnboardingMessage} className="max-w-lg mx-auto mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Ask it a question about your knowledge..."
                className="input flex-1 px-3 py-2 border border-line rounded-lg text-sm"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                disabled={sending}
              />
              <button type="submit" className="btn btn-primary" disabled={sending}>
                Send
              </button>
            </form>

            <div className="flex justify-center gap-3 mt-8">
              <button className="btn border" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>
                Looks Good →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Go Live */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Deploy & Verify widget</h2>
            <p className="text-ink-muted max-w-md mx-auto text-sm">
              Embed this simple script tag into the HTML body of your website to go live.
            </p>
            <div className="max-w-lg mx-auto mt-4 text-left">
              <pre className="bg-surface-2 border border-line p-3 rounded-lg text-xs font-mono select-all overflow-x-auto">
                {widgetSnippet}
              </pre>
            </div>
            <p className="text-ink-muted text-xs max-w-md mx-auto mt-2">
              Once installed, the floating bubble chat assistant will interact with your visitor directly.
            </p>
            
            <div className="border-t border-line mt-6 pt-5 max-w-lg mx-auto flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <button onClick={handleVerify} className="btn btn-primary" disabled={verifyStatus === "checking"}>
                  {verifyStatus === "checking" ? "Checking…" : verifyStatus === "ok" ? "✓ Installed" : "Verify installation"}
                </button>
                {verifyStatus === "ok" && <span className="text-success text-[13.5px] font-semibold">✓ Connected!</span>}
                {verifyStatus === "failed" && <span className="text-hot text-[13.5px] font-semibold">Widget not detected yet. Make sure to embed and reload the page.</span>}
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              <button className="btn border" onClick={() => setStep(3)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(5)} disabled={verifyStatus !== "ok"}>
                Proceed to Live
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Live */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Agent is live!</h2>
            <p className="text-ink-muted max-w-md mx-auto text-sm">
              Your AI workspace agent is configured and active. Conversations will populate your dashboard as visitors interact.
            </p>
            <div className="flex justify-center gap-3 mt-8">
              <button className="btn border" onClick={() => setStep(4)}>
                Back
              </button>
              <button className="btn btn-primary bg-success text-[#ffffff]" onClick={() => navigate("/app")}>
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

