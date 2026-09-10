import { useEffect, useState, useMemo } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { GSpinner, GEmptyState } from "../components/grok";
import { api } from "../lib/api";
import { getCached, setCached } from "../lib/cache";
import type { Agent } from "../types/agent";
import { MOCK_AGENTS } from "../data/mockAgents";
import { renderConnectorIcon } from "../components/renderConnectorIcon";
import { CreateAgentModal } from "../components/CreateAgentModal";
import { Badge } from "../components/ui/badge";
import { AgentAvatar } from "../components/ui/agent-avatar";
import { ArrowRight, Bot, Search, Plus, Sparkles, X } from "lucide-react";

export function AgentsNew() {
  return <Navigate to="/app/templates" replace />;
}

export function Employees() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>(() => getCached("agentsListCache") || []);
  const [loading, setLoading] = useState(() => !getCached("agentsListCache"));
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get("/agents");
        setCached("agentsListCache", data);
        const list = Array.isArray(data) ? data : (data?.agents ?? []);
        setAgents(list.length > 0 ? list : (MOCK_AGENTS as unknown as Agent[]));
      } catch {
        setAgents(MOCK_AGENTS as unknown as Agent[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;

      return (
        a.name.toLowerCase().includes(q) ||
        (a.persona && a.persona.toLowerCase().includes(q)) ||
        (a.goal && a.goal.toLowerCase().includes(q)) ||
        (a.role && a.role.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        (a.kind && a.kind.toLowerCase().includes(q))
      );
    });
  }, [agents, search]);

  if (loading && agents.length === 0) return <GSpinner />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadein pb-16">
      {/* Create Agent Modal */}
      <CreateAgentModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* Clean Unified Header with Search & CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#09090B] tracking-tight">
              AI Employees
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs rounded-full px-2.5 bg-[#F4F5F6] text-[#09090B] border border-[#E5E7EB]">
              {agents.length} active
            </Badge>
          </div>
          <p className="text-[13.5px] text-[#64748B] mt-1 font-normal">
            Autonomous enterprise workforce executing workflows across Chat, Voice, and CRM tools.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative min-w-[220px] sm:w-68">
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-full border border-[#E5E7EB] bg-white text-[#09090B] placeholder-[#94A3B8] focus:outline-none focus:border-[#09090B] transition-all shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#09090B] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => navigate({ to: "/app/studio" })}
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-4 py-2 text-[13px] font-semibold text-[#09090B] hover:bg-[#F4F5F6] transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#475569]" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#09090B] text-white px-4 py-2 text-[13px] font-semibold hover:bg-black transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.12)] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create AI Employee</span>
          </button>
        </div>
      </div>

      {/* Roster Card Grid */}
      {filteredAgents.length === 0 ? (
        <GEmptyState
          icon={<Bot className="w-6 h-6 text-slate-600" />}
          title="No AI Employees found"
          body="Try adjusting your search query or deploy a new employee from the prebuilt templates catalogue."
          action={
            <button onClick={() => setShowCreateModal(true)} className="g-btn mt-3">
              Create AI Employee
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => {
            const isVoice = agent.kind === "voice";
            const isHybrid = (agent.kind as string) === "hybrid" || (agent.kind as string) === "omnichannel";
            const tools: string[] = (agent as any).connectedTools || ["salesforce", "gmail", "slack"];

            const description = agent.description && agent.description.length > 10
              ? agent.description
              : isVoice 
              ? "Autonomous Voice AI Employee handling inbound customer calls, lead qualification, and CRM updates."
              : isHybrid
              ? "Multi-modal AI Employee synchronizing Chat and Voice customer interactions with CRM logging."
              : "Autonomous Chat AI Employee capturing requirements and qualifying website visitors.";

            const roleTitle = (agent as any).role || (agent as any).persona || "Autonomous Specialist";

            return (
              <div
                key={agent.id}
                onClick={() => navigate({ to: `/app/agents/${agent.id}` })}
                className="group rounded-3xl bg-white border border-[#E5E7EB] p-6 hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[220px] cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4"
              >
                <div>
                  {/* Card Header Top */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <AgentAvatar
                        name={agent.name}
                        kind={agent.kind}
                        role={roleTitle}
                        size="md"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-[16px] text-[#09090B] tracking-tight leading-tight truncate">
                          {agent.name}
                        </h3>
                        <span className="text-[12px] text-[#64748B] font-medium block mt-0.5 truncate">
                          {roleTitle}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Agent
                    </span>
                  </div>

                  {/* Capability & Channel Tags */}
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#09090B] text-white">
                      {isHybrid ? "Hybrid V2" : isVoice ? "Voice" : "Chat"}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F4F5F6] text-[#64748B] border border-[#E5E7EB]">
                      #{isVoice ? "telephony" : "inbound"}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F4F5F6] text-[#64748B] border border-[#E5E7EB]">
                      #{isVoice ? "support-calls" : "lead-capture"}
                    </span>
                  </div>

                  {/* Clean Mandate Description */}
                  <p className="text-[12.5px] text-[#64748B] leading-relaxed line-clamp-2">
                    {description}
                  </p>
                </div>

                {/* Card Bottom: Authorized Tools + Direct Action */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] mt-auto">
                  <div className="flex items-center gap-1.5">
                    {tools.slice(0, 4).map((tool) => (
                      <span
                        key={tool}
                        title={tool}
                        className="w-6 h-6 rounded-md bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#09090B] text-xs"
                      >
                        {renderConnectorIcon(tool)}
                      </span>
                    ))}
                    {tools.length > 4 && (
                      <span className="text-[11px] font-medium text-[#94A3B8]">
                        +{tools.length - 4}
                      </span>
                    )}
                  </div>

                  <span className="text-[13px] font-semibold text-[#09090B] group-hover:text-black flex items-center gap-1 transition-all">
                    <span>Operations Desk</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Employees;
