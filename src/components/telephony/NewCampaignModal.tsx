import { useState, useEffect } from "react";
import * as I from "../icons";
import { api } from "../../lib/api";
import { LoadingSpinner } from "../grok";
import type { Agent } from "../../types/agent";
import type { Lead } from "../../types/lead";
import { GModal } from "../grok";

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated?: (campaign: any) => void;
}

export function NewCampaignModal({ isOpen, onClose, onCampaignCreated }: NewCampaignModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [isCustomFromNumber, setIsCustomFromNumber] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [rawPhoneInput, setRawPhoneInput] = useState("");
  const [inputMode, setInputMode] = useState<"select_leads" | "manual_paste">("select_leads");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const loadData = async () => {
      try {
        const agentsData: Agent[] = await api.get("/agents");
        setAgents(agentsData.filter((a) => a.kind === "voice"));
        const numbersData: any[] = await api.get("/telephony/numbers");
        setPhoneNumbers(numbersData.filter((n) => String(n.status).toLowerCase() === "connected"));
        const leadsData: Lead[] = await api.get("/leads");
        setLeads(leadsData);

        const firstAgentId = agentsData && agentsData.length > 0 ? agentsData[0].id : "";
        if (firstAgentId && !selectedAgentId) {
          setSelectedAgentId(firstAgentId);
        }

        if (numbersData && numbersData.length > 0) {
          const matchingNumber = numbersData.find((n: any) => n.agentId === firstAgentId) || numbersData[0];
          setFromNumber(matchingNumber?.e164 ? String(matchingNumber.e164) : "");
          setIsCustomFromNumber(false);
        } else {
          setIsCustomFromNumber(true);
        }
      } catch (err: unknown) {
        console.error("Failed to load campaign modal prerequisites", err);
      }
    };
    loadData();
  }, [isOpen, selectedAgentId]);

  const handleAgentChange = (newAgentId: string) => {
    setSelectedAgentId(newAgentId);
    if (phoneNumbers.length > 0) {
      const matchingNumber = phoneNumbers.find((n: any) => n.agentId === newAgentId);
      if (matchingNumber) {
        setFromNumber(matchingNumber.e164 as string);
        setIsCustomFromNumber(false);
      }
    }
  };

  if (!isOpen) return null;

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllLeads = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      setError("Please provide a campaign name");
      return;
    }
    if (!selectedAgentId) {
      setError("Please choose a Voice Agent");
      return;
    }
    if (!fromNumber.trim()) {
      setError("Please select or enter a connected Vobiz Caller ID number");
      return;
    }

    let payloadLeads: { phone: string; name?: string; leadId?: string }[] = [];

    if (inputMode === "select_leads") {
      const chosenLeads = leads.filter((l) => selectedLeadIds.includes(l.id));
      if (chosenLeads.length === 0) {
        setError("Please select at least one lead for the campaign");
        return;
      }
      payloadLeads = chosenLeads.map((l) => ({
        phone: l.phone || "+18005550199",
        name: l.name || "Customer",
        leadId: l.id,
      }));
    } else {
      const lines = rawPhoneInput
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        setError("Please enter at least one phone number");
        return;
      }

      payloadLeads = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 2) {
          return { name: parts[0], phone: parts[1] };
        }
        return { phone: parts[0] };
      });
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.post("/telephony/outbound/campaigns", {
        agentId: selectedAgentId,
        fromNumber: fromNumber.trim() || undefined,
        name: campaignName.trim(),
        customPrompt: customPrompt.trim() || undefined,
        leads: payloadLeads,
      });

      if (onCampaignCreated) onCampaignCreated(result);
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to launch campaign");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return (
    <GModal
      open={true}
      onClose={onClose}
      title="New Outbound Campaign"
      subtitle="Automated Voice Agent Calling Queue"
      icon={<I.Users width={16} height={16} />}
    >
      <div className="-m-6">
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50/50 border border-red-100 text-red-600 rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Campaign Name & Voice Agent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="field-label mb-1 text-[12px] font-semibold text-[var(--g-foreground)]">Campaign Name</label>
              <input
                type="text"
                className="input w-full text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none focus:border-[var(--g-foreground)]"
                placeholder="e.g. Q3 Sales Follow-up"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label mb-1 text-[12px] font-semibold text-[var(--g-foreground)]">Voice Agent</label>
              <select
                className="input w-full text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none focus:border-[var(--g-foreground)]"
                value={selectedAgentId}
                onChange={(e) => handleAgentChange(e.target.value)}
                required
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.kind || "Vani"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Campaign Prompt */}
          <div>
            <label className="field-label mb-1 text-[12px] font-semibold text-[var(--g-foreground)] flex items-center justify-between">
              <span>Campaign Custom Instructions (Optional)</span>
              <span className="text-[11px] text-[var(--g-muted-foreground)] font-normal">Overrides default agent greeting/goal</span>
            </label>
            <textarea
              className="input w-full text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none focus:border-[var(--g-foreground)] min-h-[70px] resize-none"
              placeholder="e.g. Introduce yourself, explain the summer promo discount, and ask if they would like a 10-minute demo this week."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>

          {/* Caller ID Number Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="field-label !mb-0 text-[12px] font-semibold text-[var(--g-foreground)]">Caller ID (Vobiz Number)</label>
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
                className="input w-full text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none focus:border-[var(--g-foreground)] font-mono"
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
                  <option key={n.id} value={n.e164}>
                    {n.e164} {n.agent?.name ? `(${n.agent.name})` : ""} {n.status === "connected" ? "✓" : `(${n.status})`}
                  </option>
                ))}
                <option value="__custom__">+ Enter custom caller ID...</option>
              </select>
            ) : (
              <input
                type="tel"
                className="input w-full text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none focus:border-[var(--g-foreground)] font-mono"
                placeholder="+91..."
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
                required
              />
            )}
            {phoneNumbers.length === 0 && (
              <p className="text-[11px] text-[var(--g-muted-foreground)] mt-1">
                No numbers connected in Agent Studio. Enter your Vobiz number manually above.
              </p>
            )}
          </div>

          {/* Source Selection (CRM Leads vs Custom Array) */}
          <div>
            <label className="field-label mb-1 text-[12px] font-semibold text-[var(--g-foreground)] flex items-center justify-between">
              <span>Recipients</span>
              
              <div className="bg-[var(--g-surface-2)] p-1 rounded-lg flex items-center gap-1 border border-[var(--g-border)]">
                <button
                  type="button"
                  onClick={() => setInputMode("select_leads")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                    inputMode === "select_leads" ? "bg-[var(--g-surface)] text-[var(--g-foreground)] shadow-sm border border-[var(--g-border)]" : "text-[var(--g-muted-foreground)]"
                  }`}
                >
                  From CRM Contacts
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("manual_paste")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                    inputMode === "manual_paste" ? "bg-[var(--g-surface)] text-[var(--g-foreground)] shadow-sm border border-[var(--g-border)]" : "text-[var(--g-muted-foreground)]"
                  }`}
                >
                  Paste CSV List
                </button>
              </div>
            </label>

            {inputMode === "select_leads" ? (
              <div className="border border-[var(--g-border)] rounded-xl overflow-hidden mt-2 bg-[#ffffff]">
                <div className="p-2.5 bg-[var(--g-surface-2)] border-b border-[var(--g-border)] flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[var(--g-muted-foreground)]">
                    {selectedLeadIds.length} of {leads.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllLeads}
                    className="text-[var(--g-foreground)] font-semibold hover:underline"
                  >
                    {selectedLeadIds.length === leads.length ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-[var(--g-border-light)] scrollbar-thin">
                  {leads.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[var(--g-muted-foreground)]">
                      No CRM leads found. Try switching to CSV paste mode.
                    </div>
                  ) : (
                    leads.map((l) => (
                      <label
                        key={l.id}
                        className="flex items-center gap-3 p-2.5 hover:bg-[var(--g-surface)] cursor-pointer transition text-[12px]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(l.id)}
                          onChange={() => handleToggleLead(l.id)}
                          className="rounded text-[var(--g-foreground)] focus:ring-[var(--g-foreground)] w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[var(--g-foreground)] truncate">{l.name || "Unnamed Lead"}</div>
                          <div className="text-[var(--g-muted-foreground)] text-[11px] truncate">
                            {l.phone || "No phone"} · {l.email || "No email"}
                          </div>
                        </div>
                        <span className="g-pill g-pill-muted !py-0.5 !px-2 !text-[10px]">
                          {l.score}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <textarea
                  className="input w-full px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none focus:border-[var(--g-foreground)] min-h-[110px] text-xs font-mono resize-none leading-relaxed"
                  placeholder="Format: Name, +14155550123 (one per line)&#10;Alice Smith, +14155550123&#10;Bob Jones, +14155550124"
                  value={rawPhoneInput}
                  onChange={(e) => setRawPhoneInput(e.target.value)}
                />
                <p className="text-[11px] text-[var(--g-muted-foreground)] mt-1">
                  Enter one recipient per line in <code>Name, Phone</code> format.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[var(--g-border-light)]">
            <button type="button" onClick={onClose} className="g-btn-2 text-[13px] h-[36px] px-4 font-semibold cursor-pointer shadow-xs" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || agents.length === 0}
              className="g-btn text-[13px] h-[36px] px-4 font-semibold cursor-pointer disabled:opacity-40 shadow-xs flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating Campaign...
                </>
              ) : (
                <>
                  <I.Play width={13} height={13} /> Launch Outbound Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </GModal>
  );
}
