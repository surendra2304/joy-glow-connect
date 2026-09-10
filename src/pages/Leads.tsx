import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { PageHead, ScoreBadge, StateBlock, Loading } from "../components/grok";
import * as I from "../components/icons";
import { api, getAccessToken } from "../lib/api";
import { API_BASE_URL, formatTime } from "../lib/utils";
import { OutboundDialerModal } from "../components/telephony/OutboundDialerModal";
import type { Lead } from "../types/lead";
import type { Message } from "../types/conversation";

const statusStyle: Record<string, string> = {
  New: "g-pill g-pill-muted",
  Contacted: "g-pill g-pill-strong text-cold",
  Qualified: "g-pill g-pill-strong text-warm",
  Won: "g-pill g-pill-solid",
  Lost: "g-pill text-[var(--g-muted-foreground)]",
};

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [scoreFilter, setScoreFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Dialer Modal State
  const [dialerOpen, setDialerOpen] = useState(false);
  const [dialerTarget, setDialerTarget] = useState<{ phone: string; name: string; leadId: string }>({
    phone: "",
    name: "",
    leadId: "",
  });

  const scoreOptions = ["All", "Hot", "Warm", "Cold"];
  const statusOptions = ["All", "New", "Contacted", "Won", "Lost"];

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53,
    overscan: 5,
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = "";
      const params: string[] = [];
      if (scoreFilter !== "All") params.push(`score=${scoreFilter}`);
      if (statusFilter !== "All") params.push(`status=${statusFilter}`);
      if (params.length > 0) query = `?${params.join("&")}`;

      const data = await api.get(`/leads${query}`);
      setLeads(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to load leads list");
    } finally {
      setLoading(false);
    }
  }, [scoreFilter, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleExportCsv = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${API_BASE_URL}/leads/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to export CSV");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to download CSV");
    }
  };

  const handleOpenDialer = (lead?: Lead) => {
    if (lead) {
      setDialerTarget({
        phone: lead.phone || "",
        name: lead.name || "Customer",
        leadId: lead.id,
      });
    } else {
      setDialerTarget({ phone: "", name: "", leadId: "" });
    }
    setDialerOpen(true);
  };


  return (
    <>
      <PageHead
        title="Leads"
        subtitle="Captured, scored, and ready to convert."
        right={
          <div className="flex items-center gap-2.5">
            <button
              className="g-btn"
              onClick={() => handleOpenDialer()}
            >
              <I.Phone width={14} height={14} /> <span>Quick Dial</span>
            </button>
            <button className="g-btn-2" onClick={handleExportCsv}>
              Export CSV
            </button>
          </div>
        }
      />

      {error && (
        <div className="g-card p-4 text-red-700 border border-red-200 bg-red-50 mb-4 flex justify-between items-center text-xs">
          <span>{error}</span>
          <button className="g-btn-2 text-[12px] h-[30px] px-3 font-medium" onClick={fetchLeads}>
            Retry
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-6 items-center mb-4 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--g-muted-foreground)] font-medium">Score:</span>
          <div className="flex gap-1">
            {scoreOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setScoreFilter(opt)}
                className={`px-3 py-1 text-[12px] rounded-full transition-all cursor-pointer ${
                  scoreFilter === opt
                    ? "bg-[var(--g-foreground)] text-[var(--g-background)] font-semibold shadow-xs"
                    : "text-[var(--g-muted-foreground)] hover:text-[var(--g-foreground)] hover:bg-[var(--g-surface-2)]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[var(--g-muted-foreground)] font-medium">Status:</span>
          <div className="flex gap-1">
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-3 py-1 text-[12px] rounded-full transition-all cursor-pointer ${
                  statusFilter === opt
                    ? "bg-[var(--g-foreground)] text-[var(--g-background)] font-semibold shadow-xs"
                    : "text-[var(--g-muted-foreground)] hover:text-[var(--g-foreground)] hover:bg-[var(--g-surface-2)]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="g-card fadeup overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loading label="Loading leads" subtitle="Fetching captured and qualified prospects" />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <StateBlock
              title="No leads found"
              body="No leads match the selected score or status filters, or no leads have been captured yet."
            />
          </div>
        ) : (
          <div ref={parentRef} className="overflow-auto max-h-[640px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="text-ink-muted text-left text-[12.5px] font-semibold border-b border-line">
                  {["Name", "Contact", "Score", "Status", "Source", "Date", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold bg-surface">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowVirtualizer.getVirtualItems().length > 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        height: `${rowVirtualizer.getVirtualItems()[0]?.start || 0}px`,
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const l = leads[virtualRow.index];
                  if (!l) return null;
                  return (
                    <tr
                      key={l.id}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      className="border-b border-line hover:bg-surface-2 transition"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          to="/app/agents"
                          className="font-semibold hover:text-[var(--g-muted-foreground)] text-[var(--g-foreground)]"
                        >
                          {l.name || "Anonymous Lead"}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-ink-muted">
                        <span className="block">{l.email || "No email"}</span>
                        {l.phone && <span className="block text-xs text-ink-muted">{l.phone}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <ScoreBadge score={(l.score || "Cold") as "Hot" | "Warm" | "Cold"} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={statusStyle[(l.status as "New" | "Contacted" | "Qualified" | "Won" | "Lost") || "New"] || "g-pill g-pill-muted"}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-muted capitalize">{l.source || "web"}</td>
                      <td className="px-5 py-3.5 text-ink-muted">{formatTime(l.createdAt)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenDialer(l)}
                          className="g-btn-2 !px-3 !py-1 !text-xs"
                          title="Call Lead with AI Voice Agent"
                        >
                          <I.Phone width={12} height={12} /> Call
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {rowVirtualizer.getVirtualItems().length > 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        height: `${
                          rowVirtualizer.getTotalSize() -
                          (rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1]?.end || 0)
                        }px`,
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Outbound Dialer Modal */}
      <OutboundDialerModal
        isOpen={dialerOpen}
        onClose={() => setDialerOpen(false)}
        initialPhone={dialerTarget.phone}
        initialName={dialerTarget.name}
        initialLeadId={dialerTarget.leadId}
        onCallInitiated={() => {
          fetchLeads();
        }}
      />
    </>
  );
}

export function LeadDetail() {
  const { id } = useParams({ strict: false });
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialerOpen, setDialerOpen] = useState(false);

  const fetchLeadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/leads/${id}`);
      setLead(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLeadDetail();
  }, [fetchLeadDetail]);

  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!lead || !id) return;
    setUpdateError(null);
    try {
      setLead((prev: Lead | null) => (prev ? { ...prev, status: newStatus as any } : null));
      await api.patch(`/leads/${id}`, { status: newStatus });
    } catch (err: unknown) {
      const error = err as Error;
      setUpdateError(error.message || "Failed to update lead status");
      fetchLeadDetail();
    }
  };

  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (loading) {
    return (
      <div className="g-card py-24 flex items-center justify-center fadeup">
        <Loading label="Loading lead profile" subtitle="Retrieving intelligence and timeline" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="g-card p-8 text-center text-red-700 bg-red-50 border border-red-200">
        <p className="font-semibold text-sm">{error || "Lead not found"}</p>
        <Link to="/app/leads" className="g-btn mt-4 inline-block">
          Back to Leads
        </Link>
      </div>
    );
  }

  const capturedFields: string[] = [];
  if (lead.name) capturedFields.push("Name");
  if (lead.email) capturedFields.push("Email");
  if (lead.phone) capturedFields.push("Phone");

  return (
    <>
      <div className="flex items-center justify-between mb-5 fadeup">
        <div className="flex items-center gap-2.5 text-ink-muted text-[13.5px] font-semibold">
          <Link to="/app/leads" className="hover:text-ink">
            ← Leads
          </Link>
          <span className="text-ink ml-1">{lead.name || "Anonymous Lead"}</span>
          <span className="ml-2">
            <ScoreBadge score={(lead.score || "Cold") as "Hot" | "Warm" | "Cold"} />
          </span>
        </div>

        <button
          onClick={() => setDialerOpen(true)}
          className="g-btn flex items-center gap-2 !py-1.5"
        >
          <I.Phone width={14} height={14} /> Call Lead Now
        </button>
      </div>

        <div className="grid grid-cols-[1.3fr_1fr] gap-4 fadeup">
        {/* Conversation & Contact Information Card */}
        <div className="g-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-6 pb-4 border-b border-line mb-4">
              <span className="text-[14px]">
                <span className="text-[var(--g-muted-foreground)] text-[12.5px] block">Email</span>
                {lead.email ? (
                  <span className="flex items-center gap-1">
                    <button
                      className="text-[var(--g-muted-foreground)] hover:text-[var(--g-foreground)] flex items-center justify-center p-0.5 rounded transition"
                      onClick={() => copyToClipboard(lead.email || "")}
                    >
                      {lead.email} {copiedItem === lead.email && <span className="text-emerald-600 text-xs ml-1">Copied!</span>}
                    </button>
                  </span>
                ) : (
                  <span className="text-ink-muted italic">Not provided</span>
                )}
              </span>

              <span className="text-[14px]">
                <span className="text-[var(--g-muted-foreground)] text-[12.5px] block">Phone</span>
                {lead.phone ? (
                  <span className="flex items-center gap-1">
                    <button
                      className="text-[var(--g-muted-foreground)] hover:text-[var(--g-foreground)] flex items-center justify-center p-0.5 rounded transition"
                      onClick={() => copyToClipboard(lead.phone || "")}
                    >
                      {lead.phone} {copiedItem === lead.phone && <span className="text-emerald-600 text-xs ml-1">Copied!</span>}
                    </button>
                  </span>
                ) : (
                  <span className="text-ink-muted italic">Not provided</span>
                )}
              </span>
            </div>

            <h3 className="font-display font-bold mt-4 mb-3 text-[15px]">Conversation</h3>
            <div className="space-y-4 text-[13.5px] max-h-[320px] overflow-y-auto pr-1">
              {lead.conversation?.messages && lead.conversation.messages.length > 0 ? (
                lead.conversation.messages.map((m: Message) => {
                  const isVisitor = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={
                        isVisitor
                          ? ""
                          : "bg-[var(--g-surface-2)] border border-[var(--g-border)] rounded-xl px-3 py-2"
                      }
                    >
                      <span className="text-ink-muted font-semibold mr-1">
                        {isVisitor ? "Visitor:" : "AI:"}
                      </span>
                      {m.content}
                    </div>
                  );
                })
              ) : (
                <div className="text-ink-muted italic py-4">
                  No logged messages found for this lead session.
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 mt-6 border-t border-line pt-4">
            <button
              className={lead.status === "Contacted" ? "g-btn" : "g-btn-2"}
              onClick={() => handleUpdateStatus("Contacted")}
            >
              Mark Contacted
            </button>
            <button
              className={lead.status === "Won" ? "g-btn bg-[#22c55e] text-[#ffffff]" : "g-btn-2"}
              onClick={() => handleUpdateStatus("Won")}
            >
              Won
            </button>
            <button
              className={lead.status === "Lost" ? "g-btn bg-[var(--g-muted-foreground)] text-[#ffffff]" : "g-btn-2"}
              onClick={() => handleUpdateStatus("Lost")}
            >
              Lost
            </button>
          </div>
          {updateError && (
            <div className="mt-4 p-2 bg-red-50 text-red-600 text-[11px] rounded border border-red-200">
              {updateError}
            </div>
          )}
        </div>

        {/* AI Insights Card */}
        <div className="g-card p-5">
          <h3 className="font-display font-bold text-[15px] flex items-center gap-2 mb-4">
            <I.Sparkle width={15} height={15} className="text-[var(--g-foreground)]" /> AI insights
          </h3>
          <dl className="space-y-4 text-[13.5px]">
            <div>
              <dt className="text-ink-muted text-[12.5px]">Intent Summary</dt>
              <dd className="font-semibold text-ink mt-0.5">{lead.intent || "No intent captured"}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-[12.5px]">Why {lead.score}</dt>
              <dd className="mt-0.5 leading-relaxed text-ink">
                {lead.aiNote || "No detail provided"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted text-[12.5px]">Captured Fields</dt>
              <dd className="mt-0.5 font-semibold text-[var(--g-foreground)]">
                {capturedFields.length > 0 ? capturedFields.join(", ") : "None yet"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted text-[12.5px]">Source Channel</dt>
              <dd className="mt-0.5 capitalize text-ink-muted">{lead.source || "web"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <OutboundDialerModal
        isOpen={dialerOpen}
        onClose={() => setDialerOpen(false)}
        initialPhone={lead.phone || ""}
        initialName={lead.name || "Customer"}
        initialLeadId={lead.id}
        onCallInitiated={() => fetchLeadDetail()}
      />
    </>
  );
}

