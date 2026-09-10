import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as I from "../icons";
import { api } from "../../lib/api";
import { LoadingSpinner } from "../grok";
import type { Agent } from "../../types/agent";

interface OutboundDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  initialName?: string;
  initialLeadId?: string;
  onCallInitiated?: (callData: any) => void;
}

export function OutboundDialerModal({
  isOpen,
  onClose,
  initialPhone = "",
  initialName = "",
  initialLeadId,
  onCallInitiated,
}: OutboundDialerModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [phone, setPhone] = useState(initialPhone);
  const [fromNumber, setFromNumber] = useState("");
  const [isCustomFromNumber, setIsCustomFromNumber] = useState(false);
  const [recipientName, setRecipientName] = useState(initialName);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected" | "ended">("idle");
  const [callSid, setCallSid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Sync initial props
  useEffect(() => {
    if (isOpen) {
      setPhone(initialPhone);
      setRecipientName(initialName);
      setCallState("idle");
      setCallSid(null);
      setError(null);
      setElapsedSec(0);
    }
  }, [isOpen, initialPhone, initialName]);

  // Load voice agents & connected phone numbers from workspace
  useEffect(() => {
    if (!isOpen) return;
    const fetchPrerequisites = async () => {
      try {
        const agentsData: Agent[] = await api.get("/agents?kind=voice");
        const numbersData: Record<string, unknown>[] = await api.get("/telephony/numbers").catch(() => []);

        setAgents(agentsData || []);
        setPhoneNumbers(numbersData || []);

        // Pre-select agent
        const firstAgentId = agentsData && agentsData.length > 0 ? agentsData[0].id : "";
        if (firstAgentId && !selectedAgentId) {
          setSelectedAgentId(firstAgentId);
        }

        // Auto-select connected phone number for the agent if available
        if (numbersData && numbersData.length > 0) {
          const matchingNumber = numbersData.find((n) => n.agentId === firstAgentId) || numbersData[0];
          setFromNumber(String(matchingNumber.e164));
          setIsCustomFromNumber(false);
        } else {
          setIsCustomFromNumber(true);
        }
      } catch (err: unknown) {
        console.error("Failed to load voice agents & phone numbers", err);
      }
    };
    fetchPrerequisites();
  }, [isOpen, selectedAgentId]);

  // When selected agent changes, automatically select its assigned connected phone number
  const handleAgentChange = (newAgentId: string) => {
    setSelectedAgentId(newAgentId);
    if (phoneNumbers.length > 0) {
      const matchingNumber = phoneNumbers.find((n) => n.agentId === newAgentId);
      if (matchingNumber) {
        setFromNumber(String(matchingNumber.e164));
        setIsCustomFromNumber(false);
      }
    }
  };

  // Call duration counter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callState === "connected") {
      interval = setInterval(() => {
        setElapsedSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Please provide a valid recipient phone number");
      return;
    }
    if (!selectedAgentId) {
      setError("Please select a Voice Agent to place the call");
      return;
    }
    if (!fromNumber.trim()) {
      setError("Please select or enter a connected Vobiz Caller ID number");
      return;
    }

    setLoading(true);
    setError(null);
    setCallState("dialing");

    try {
      const res = await api.post("/telephony/outbound/dial", {
        agentId: selectedAgentId,
        phone: phone.trim(),
        fromNumber: fromNumber.trim() || undefined,
        recipientName: recipientName.trim() || undefined,
        leadId: initialLeadId || undefined,
        customPrompt: customPrompt.trim() || undefined,
      });

      setCallSid(res.callSid);
      setCallState("connected");
      if (onCallInitiated) onCallInitiated(res);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to initiate outbound call");
      setCallState("idle");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-md animate-fade-in"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && callState !== "connected") onClose();
      }}
    >
      <div className="bg-[#ffffff] border border-[var(--g-border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up text-left">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--g-border-light)] bg-[var(--g-surface)]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[var(--g-surface-2)] text-[var(--g-foreground)] border border-[var(--g-border)] grid place-items-center">
              <I.Phone width={16} height={16} />
            </span>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--g-foreground)]">Outbound AI Dialer</h3>
              <p className="text-[var(--g-muted-foreground)] text-xs">Direct Speech-to-Speech Phone Call</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-[var(--g-muted-foreground)] hover:text-[var(--g-foreground)] grid place-items-center"
          >
            <I.X width={16} height={16} />
          </button>
        </div>

        {/* Live Call Interface */}
        {callState === "connected" ? (
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-[var(--g-surface-2)] border border-[var(--g-border)] grid place-items-center text-2xl">
                🎙️
              </div>
              <div className="absolute inset-0 rounded-full bg-[var(--g-foreground)] opacity-20 animate-ping" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--g-foreground)]">Call In Progress</div>
              <div className="font-display text-xl font-bold text-ink mt-1">
                {recipientName || phone}
              </div>
              <div className="text-xs text-ink-muted mt-0.5">{phone}</div>
              <div className="font-mono text-lg font-bold text-[var(--g-foreground)] mt-2">
                {formatTimer(elapsedSec)}
              </div>
              {callSid && (
                <div className="text-[10px] text-ink-muted mt-1 font-mono truncate">
                  SID: {callSid}
                </div>
              )}
            </div>

            <div className="p-3 bg-surface-2 border border-line rounded-xl text-left text-xs text-ink-muted leading-relaxed">
              <div className="font-semibold text-ink mb-1">AI Live Connection Active</div>
              Gemini 2.5 Live is speaking directly with the caller. All speech and dual-channel audio will be automatically transcribed and saved to call logs.
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setCallState("ended");
                  setTimeout(onClose, 1000);
                }}
                className="g-btn-2 text-xs px-4"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStartCall} className="p-5 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <I.AlertTriangle width={14} height={14} /> {error}
              </div>
            )}

            {/* Select Agent */}
            <div>
              <label className="field-label flex items-center justify-between">
                <span>Voice Agent</span>
                <span className="text-[11px] text-ink-muted font-normal">Speech-to-Speech</span>
              </label>
              <select
                className="input"
                value={selectedAgentId}
                onChange={(e) => handleAgentChange(e.target.value)}
                required
              >
                {agents.length === 0 ? (
                  <option value="">No Voice Agents Available</option>
                ) : (
                  agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.voiceName || "Vani"})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Caller ID (Connected Numbers Dropdown) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="field-label !mb-0">Caller ID (Vobiz Number)</label>
                {phoneNumbers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCustomFromNumber(!isCustomFromNumber)}
                    className="text-[11px] text-[var(--g-foreground)] font-semibold hover:underline"
                  >
                    {isCustomFromNumber ? "Choose from connected" : "+ Enter custom"}
                  </button>
                )}
              </div>

              {!isCustomFromNumber && phoneNumbers.length > 0 ? (
                <select
                  className="input text-xs font-mono"
                  value={fromNumber}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomFromNumber(true);
                      setFromNumber("");
                    } else {
                      setFromNumber(e.target.value);
                    }
                  }}
                  required
                >
                  {phoneNumbers.map((n) => (
                    <option key={String(n.id)} value={String(n.e164)}>
                      {n.e164} {(n.agent as Record<string, unknown>)?.name ? `(${(n.agent as Record<string, unknown>).name})` : ""} {n.status === "connected" ? "✓" : `(${n.status})`}
                    </option>
                  ))}
                  <option value="__custom__">+ Enter custom caller ID...</option>
                </select>
              ) : (
                <input
                  type="tel"
                  className="input text-xs font-mono"
                  placeholder="+91..."
                  value={fromNumber}
                  onChange={(e) => setFromNumber(e.target.value)}
                  required
                />
              )}
              {phoneNumbers.length === 0 && (
                <p className="text-[11px] text-ink-muted mt-1">
                  No numbers connected in Agent Studio. Enter your Vobiz number manually above.
                </p>
              )}
            </div>

            {/* Recipient Phone & Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Recipient Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Recipient Phone (To)</label>
                <input
                  type="tel"
                  className="input text-xs font-mono"
                  placeholder="+917702897528"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Custom Call Objective / Prompt */}
            <div>
              <label className="field-label flex items-center justify-between">
                <span>Call Objective / Instructions</span>
                <span className="text-[11px] text-ink-muted font-normal">Optional</span>
              </label>
              <textarea
                className="input min-h-[72px] text-xs resize-none"
                placeholder="e.g., Follow up on the website quote request submitted today. Offer a 15% demo discount."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-line">
              <button type="button" onClick={onClose} className="g-btn-2" disabled={loading}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || agents.length === 0}
                className="g-btn flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Dialing...
                  </>
                ) : (
                  <>
                    <I.Phone width={14} height={14} /> Place Outbound Call
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

