import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "@tanstack/react-router";
import { GSpinner } from "../components/grok";
import { useEmployeeDetail } from "../hooks/useEmployeeDetail";
import { MOCK_AGENTS } from "../data/mockAgents";
import { AgentActionRunsTab } from "../components/AgentActionRunsTab";
import { AgentTicketsTab } from "../components/AgentTicketsTab";
import { AgentBookingsTab } from "../components/AgentBookingsTab";
import { AgentSimulatorSandbox } from "../components/AgentSimulatorSandbox";

import {
  PersonaTab,
  KnowledgeTab,
  ChannelsTab,
  VersionsTab,
  AgentConversationsTab,
  AgentCallsTab,
  AgentLeadsTab,
  AgentIntegrationsTab,
} from "../components/EmployeeTabs";

import { AgentAvatar } from "../components/ui/agent-avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Bot, Save, Play, Pause } from "lucide-react";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const t = searchParams.get("tab") || "overview";
    setTab(t);
  }, [searchParams]);

  const {
    agent: backendAgent,
    documents,
    versions,
    loading,
    saving,
    notice,
    error,
    fetchAll,
    updateField,
    handleSave,
    toggleStatus,
    handlePublish,
    handleRollback,
    toggleDoc
  } = useEmployeeDetail(id);

  // Fallback to mock agent if backend returns null in demo mode
  const mockAgent = useMemo(() => {
    return MOCK_AGENTS.find(a => a.id === id) || MOCK_AGENTS[0];
  }, [id]);

  const agent = backendAgent || (mockAgent as any);

  const handleTabChange = (t: string) => {
    setTab(t);
    setSearchParams({ tab: t });
  };

  if (loading && !agent) return <GSpinner />;
  if (error && !agent) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <p className="text-[14px] text-slate-900">{error}</p>
        <button className="g-btn mt-4 mx-auto cursor-pointer" onClick={fetchAll}>Retry</button>
      </div>
    );
  }
  if (!agent) return <GSpinner />;

  const isLive = agent.status === "live";
  const isVoice = agent.kind === "voice";
  const isScheduling = agent.category === "Scheduling" || agent.role?.toLowerCase().includes("schedule") || agent.name?.toLowerCase().includes("receiptnest");
  const isSupport = agent.category === "Support" || agent.role?.toLowerCase().includes("support") || agent.role?.toLowerCase().includes("ticket");

  // Dynamic Outcome Label
  const outcomesLabel = isScheduling 
    ? "Bookings" 
    : isSupport 
    ? "Tickets" 
    : "Leads Captured";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "conversations", label: isVoice ? "Recordings" : "Conversations" },
    { id: "calls", label: isVoice ? "Transcripts" : "Calls & Telephony" },
    { id: "actions", label: "⚡ Action Runs" },
    { id: "outcomes", label: `🎯 ${outcomesLabel}` },
    { id: "test", label: "Test & Simulate" },
    { id: "persona", label: "Persona & Prompt" },
    { id: "knowledge", label: "Knowledge" },
    { id: "integrations", label: "Tools" },
    { id: "channels", label: "Channels & Numbers" },
    { id: "versions", label: "Versions" },
  ];

  const connectedDocsList: string[] = (documents && documents.length > 0)
    ? documents.map((d: any) => String(d.name || d.id))
    : ["Enterprise Architecture Guide.pdf", "Pricing Matrix.pdf"];

  const connectedToolsList: string[] = (agent.connectedTools && agent.connectedTools.length > 0) 
    ? agent.connectedTools 
    : ["salesforce", "gmail", "slack"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadein">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <Link 
            to="/app/agents" 
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <AgentAvatar
              name={agent.name}
              kind={agent.kind}
              role={agent.role}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{agent.name}</h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10.5px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {agent.status === "live" ? "Live" : "Paused"}
                </Badge>
                <Badge variant="secondary" className="text-[10.5px] font-semibold capitalize">
                  {agent.kind || "chat"} Agent · v{agent.version || "2.0"}
                </Badge>
              </div>
              <p className="text-[12.5px] text-slate-500 mt-0.5">{agent.role || "Autonomous Enterprise Employee"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange("test")}
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-semibold text-[#09090B] hover:bg-[#F4F5F6] transition-all cursor-pointer shadow-2xs"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </button>
          <button
            onClick={toggleStatus}
            className={`text-[12.5px] py-2 px-4 rounded-full font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
              isLive
                ? "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? "Pause" : "Deploy Live"}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#09090B] text-white px-4 py-2 text-[12.5px] font-semibold hover:bg-black transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[12.5px] font-medium animate-fadein">
          {notice}
        </div>
      )}

      {/* Shadcn Tabs Bar */}
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-white border border-[#E5E7EB] p-1.5 rounded-2xl overflow-x-auto g-no-scrollbar max-w-full justify-start shadow-2xs gap-1">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-xl whitespace-nowrap data-[state=active]:bg-[#09090B] data-[state=active]:text-white transition-all shadow-xs"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Main Tab Content */}
      <div className="min-h-[500px]">
        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-6 animate-fadein">
            {/* Grounded 4-Column KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#E5E7EB] bg-white rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] shadow-xs overflow-hidden">
              <div className="p-5 text-center">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Invocations</div>
                <div className="text-2xl font-bold text-[#09090B] mt-1 tracking-tight">
                  {(agent.totalRuns || 18420).toLocaleString()}
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">All channels</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Success Rate</div>
                <div className="text-xl font-bold text-emerald-600 mt-1">
                  {agent.successRate || 99.2}%
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">Tool executions</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Avg Latency</div>
                <div className="text-xl font-bold text-[#09090B] mt-1">
                  {agent.avgResponseTimeMs || 240}ms
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">Gemini 2.0 Flash</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  {isSupport ? "CSAT Score" : "Conversion Rate"}
                </div>
                <div className="text-xl font-bold text-[#09090B] mt-1">
                  {isSupport ? "4.85 / 5.0" : `${agent.conversionRate || 24.8}%`}
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  {isSupport ? "Customer satisfaction" : "Qualified pipeline"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Profile & Instructions Box */}
                <div className="rounded-xl bg-white border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#09090B] uppercase tracking-wider">Mandate &amp; Objective</h3>
                    <p className="text-[13px] text-[#475569] leading-relaxed mt-1">{agent.description}</p>
                  </div>
                  <div>
                    <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">System Instructions Excerpt</h3>
                    <pre className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[12px] text-[#09090B] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {agent.systemPrompt}
                    </pre>
                  </div>
                </div>

                {/* Quick Action Runs Snippet */}
                <div className="rounded-xl bg-white border border-[#E2E8F0] p-5 shadow-2xs">
                  <div className="mb-4">
                    <h3 className="text-[14px] font-bold text-[#09090B]">Recent Tool Calls</h3>
                    <p className="text-[12px] text-[#64748B]">Real-time API execution stream.</p>
                  </div>
                  <AgentActionRunsTab agentId={agent.id} />
                </div>
              </div>

              <div className="space-y-6">
                {/* Active Configuration Box */}
                <div className="rounded-xl bg-white border border-[#E2E8F0] p-5 shadow-2xs space-y-4 text-[12.5px]">
                  <h3 className="text-[14px] font-bold text-[#09090B] uppercase tracking-wider">Connected Assets</h3>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">Authorized Tools</span>
                    <div className="flex flex-wrap gap-1.5">
                      {connectedToolsList.map((tool: string) => (
                        <span key={tool} className="px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] font-medium capitalize text-[11.5px] text-[#09090B]">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">Knowledge Grounding</span>
                    <div className="space-y-1">
                      {connectedDocsList.map((doc: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[12px] text-[#09090B]">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="truncate">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">Model Engine</span>
                    <div className="p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[11.5px] text-[#09090B]">
                      {agent.model || "gemini-2.0-flash"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Runs Tab */}
        {tab === "actions" && (
          <AgentActionRunsTab agentId={agent.id} />
        )}

        {/* Dynamic Outcomes Tab */}
        {tab === "outcomes" && (
          <>
            {isScheduling ? (
              <AgentBookingsTab agentId={agent.id} />
            ) : isSupport ? (
              <AgentTicketsTab agentId={agent.id} />
            ) : (
              <AgentLeadsTab agentId={agent.id} agentName={agent.name} />
            )}
          </>
        )}

        {/* Test & Simulate Sandbox */}
        {tab === "test" && (
          <AgentSimulatorSandbox
            agentName={agent.name}
            role={agent.role}
            kind={agent.kind}
            systemPrompt={agent.systemPrompt}
            greetingMessage={agent.greetingMessage}
            connectedTools={connectedToolsList}
            connectedDocs={connectedDocsList}
          />
        )}

        {/* Conversations & Transcripts */}
        {tab === "conversations" && (
          <AgentConversationsTab agentId={agent.id} agentName={agent.name} isVoice={isVoice} />
        )}
        {tab === "calls" && (
          <AgentCallsTab agentId={agent.id} agentName={agent.name} isVoice={isVoice} />
        )}

        {/* Configuration Tabs */}
        {tab === "persona" && (
          <PersonaTab agent={agent as any} updateField={updateField} />
        )}
        {tab === "knowledge" && (
          <KnowledgeTab agent={agent as any} documents={documents} toggleDoc={toggleDoc} />
        )}
        {tab === "integrations" && (
          <AgentIntegrationsTab agentId={agent.id} agentName={agent.name} />
        )}
        {tab === "channels" && (
          <ChannelsTab agent={agent as any} updateField={updateField} id={agent.id} onChanged={fetchAll} />
        )}
        {tab === "versions" && (
          <VersionsTab agent={agent as any} versions={versions} onPublish={handlePublish} onRollback={handleRollback} busy={saving} />
        )}
      </div>
    </div>
  );
}
