import { useState, useMemo } from "react";
import { MOCK_TICKETS } from "../data/mockTickets";
import { Select } from "./ui/select";
import * as I from "./icons";

interface AgentTicketsTabProps {
  agentId: string;
}

export function AgentTicketsTab({ agentId }: AgentTicketsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const tickets = useMemo(() => {
    const directMatches = MOCK_TICKETS.filter(t => t.agentId === agentId);
    return directMatches.length > 0 ? directMatches : MOCK_TICKETS;
  }, [agentId]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
      if (selectedPriority !== "all" && t.priority !== selectedPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.subject.toLowerCase().includes(q) ||
          t.requesterName.toLowerCase().includes(q) ||
          t.requesterEmail.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, selectedCategory, selectedPriority, searchQuery]);

  return (
    <div className="space-y-6 animate-fadein">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[var(--g-radius-lg)] border border-[var(--g-border)] bg-[var(--g-surface)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-semibold text-[16px] text-[var(--g-foreground)]">Support Tickets &amp; Issues Raised</h3>
          </div>
          <p className="text-[13px] text-[var(--g-muted-foreground)]">
            Auto-generated and categorized support tickets routed from voice and chat conversations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-[var(--g-secondary)] border border-[var(--g-border-light)] text-center">
            <div className="text-[11px] font-semibold text-[var(--g-muted-foreground)] uppercase">Total Tickets</div>
            <div className="text-[16px] font-bold text-[var(--g-foreground)]">{tickets.length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[11px] font-semibold text-emerald-600 uppercase">Auto-Triage</div>
            <div className="text-[16px] font-bold text-emerald-700">100% Categorized</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto g-no-scrollbar">
          <button
            onClick={() => setSelectedPriority("all")}
            className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-colors cursor-pointer border ${
              selectedPriority === "all"
                ? "bg-[#09090B] text-white border-[#09090B]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#09090B] hover:text-[#09090B]"
            }`}
          >
            All Priorities
          </button>
          {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold capitalize transition-colors cursor-pointer border ${
                selectedPriority === p
                  ? "bg-[#09090B] text-white border-[#09090B]"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#09090B] hover:text-[#09090B]"
              }`}
            >
              {p.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            options={[
              { value: "all", label: "All Categories" },
              { value: "Billing", label: "Billing" },
              { value: "Technical", label: "Technical" },
              { value: "Account", label: "Account" },
            ]}
            className="min-w-[140px]"
          />

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search tickets, customers, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[13px] rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] focus:outline-none focus:border-[var(--g-foreground)] transition-colors"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--g-muted-foreground)] pointer-events-none">
              <I.Search width={13} height={13} />
            </span>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="border border-[var(--g-border)] rounded-[var(--g-radius-lg)] bg-[var(--g-surface)] overflow-hidden shadow-xs">
        <div className="divide-y divide-[var(--g-border-light)]">
          {filteredTickets.map((t) => (
            <div key={t.id} className="p-4 hover:bg-[var(--g-secondary)]/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-[13px] text-[var(--g-foreground)]">{t.id}</span>
                  <span className="font-semibold text-[14.5px] text-[var(--g-foreground)]">{t.subject}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider ${
                    t.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border border-rose-200" :
                    t.priority === "HIGH" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                    "bg-blue-50 text-blue-600 border border-blue-200"
                  }`}>
                    {t.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-[var(--g-secondary)] border border-[var(--g-border-light)] text-[var(--g-foreground)]">
                    {t.category}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--g-muted-foreground)] leading-relaxed">
                  {t.aiSummary}
                </p>
                <div className="flex items-center gap-3 text-[11.5px] text-[var(--g-muted-foreground)]">
                  <span>Requester: <strong className="text-[var(--g-foreground)] font-medium">{t.requesterName} ({t.requesterEmail})</strong></span>
                  <span>·</span>
                  <span>Sentiment: <span className="font-medium text-[var(--g-foreground)]">{t.sentiment}</span></span>
                  <span>·</span>
                  <span>Assigned: <span className="font-medium text-emerald-600">{t.assignedTeam}</span></span>
                  <span>·</span>
                  <span>{t.timeAgo}</span>
                </div>
              </div>

              <div className="shrink-0 self-end md:self-center">
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                  t.status === "ESCALATED" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                  t.status === "RESOLVED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
