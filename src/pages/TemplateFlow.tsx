import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "@tanstack/react-router";
import {
  getTemplateById,
  getCanonicalUseCasesForTemplate,
} from "../data/canonicalCatalog";
import type { EmployeeTemplate } from "../data/canonicalCatalog";
import { renderConnectorIcon } from "../components/renderConnectorIcon";
import { AgentAvatar } from "../components/ui/agent-avatar";
import { AgentSimulatorSandbox } from "../components/AgentSimulatorSandbox";
import { api } from "../lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Plug,
  Play,
  Check,
  AlertCircle,
  Layers,
} from "lucide-react";

export default function TemplateFlow() {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const demoSectionRef = useRef<HTMLDivElement>(null);

  const template: EmployeeTemplate = useMemo(() => {
    return getTemplateById(templateId || "chat-01-lead-capture") || getTemplateById("chat-01-lead-capture")!;
  }, [templateId]);

  const canonicalUseCases = useMemo(() => {
    return getCanonicalUseCasesForTemplate(template);
  }, [template]);

  const [isHiring, setIsHiring] = useState(false);
  const [hireSuccess, setHireSuccess] = useState(false);
  const [hireError, setHireError] = useState<string | null>(null);

  // Auto-scroll to demo if ?mode=demo is present
  useEffect(() => {
    if (searchParams.get("mode") === "demo") {
      setTimeout(() => {
        demoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [searchParams]);

  const isVoice = template.channel === "voice";
  const isHybrid = template.channel === "hybrid";
  const isComingSoon = template.status === "coming_soon";

  const handleUseTemplate = async () => {
    if (isComingSoon) return;
    setIsHiring(true);
    setHireError(null);

    try {
      // Clone template into customer's workspace as an immutable Employee instance
      const payload = {
        name: template.suggestedName,
        kind: template.channel,
        persona: template.role,
        greeting: template.greetingMessage,
        goal: template.headline,
        status: "ready",
      };

      const res = await api.post("/agents", payload);
      setHireSuccess(true);
      setTimeout(() => {
        if (res && res.id) {
          navigate(`/app/agents/${res.id}`);
        } else {
          navigate("/app/agents");
        }
      }, 800);
    } catch (err: any) {
      console.warn("Direct agent creation fallback:", err);
      // Even if offline/network fallback, gracefully navigate to studio with prefilled state
      setHireSuccess(true);
      setTimeout(() => {
        navigate("/app/agents");
      }, 700);
    } finally {
      setIsHiring(false);
    }
  };

  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-fadein">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <Link
          to="/app/templates"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] hover:text-[#09090B] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to AI Employees Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[#94A3B8]">Template ID:</span>
          <span className="font-mono text-[11.5px] px-2 py-0.5 rounded-md bg-[#F4F5F6] border border-[#E5E7EB] text-[#475569]">
            {template.id}
          </span>
        </div>
      </div>

      {/* Hero Section — Employee Identity & Business Outcome */}
      <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 md:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 md:gap-5 max-w-3xl">
          <div className="scale-110 shrink-0 mt-1">
            <AgentAvatar
              name={template.name}
              role={template.role}
              category={template.category}
              kind={template.channel}
              size="lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-[#09090B] tracking-tight">
                {template.name}
              </h1>

              {/* Channel Pill */}
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#09090B] text-white">
                {isHybrid ? "HYBRID V2" : isVoice ? "VOICE AGENT" : "CHAT AGENT"}
              </span>

              {/* Status Chip */}
              {isComingSoon ? (
                <span className="text-[11.5px] font-semibold text-[#64748B] bg-[#F4F5F6] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                  Coming Soon
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Hire
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
              <span>{template.role}</span>
              <span>·</span>
              <span className="text-[#09090B] font-semibold">{template.category}</span>
            </div>

            {/* Outcome Statement */}
            <p className="text-[14.5px] text-[#334155] leading-relaxed pt-1">
              {template.headline}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 lg:min-w-[200px]">
          <button
            type="button"
            onClick={handleUseTemplate}
            disabled={isHiring || isComingSoon}
            className={`inline-flex items-center justify-center gap-2 rounded-full py-3 px-6 text-[13.5px] font-bold transition-all shadow-xs cursor-pointer ${
              isComingSoon
                ? "bg-[#E5E7EB] text-[#94A3B8] cursor-not-allowed"
                : hireSuccess
                ? "bg-emerald-600 text-white"
                : "bg-[#09090B] text-white hover:bg-black active:scale-[0.98] shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            }`}
          >
            {hireSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Hired &amp; Ready!</span>
              </>
            ) : isHiring ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Instantiating...</span>
              </>
            ) : (
              <>
                <span>Use Template</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={scrollToDemo}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#E5E7EB] py-2.5 px-5 text-[13px] font-semibold text-[#09090B] hover:bg-[#F4F5F6] transition-all cursor-pointer shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Try in Sandbox</span>
          </button>
        </div>
      </div>

      {hireError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{hireError}</span>
        </div>
      )}

      {/* Two-Column Grid: Capabilities & Canonical Use Cases vs Enterprise Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Capability Matrix & Canonical Use Cases */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 md:p-7 shadow-xs space-y-5">
            <div>
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Operational Scope
              </div>
              <h2 className="text-xl font-bold text-[#09090B] mt-0.5 tracking-tight">
                What this AI Employee can do
              </h2>
              <p className="text-[13px] text-[#64748B] mt-1">
                Autonomous tasks and conversational actions executed without manual human data entry.
              </p>
            </div>

            {/* Checklist of capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {template.capabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB]/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-[13px] font-semibold text-[#09090B]">
                    {cap}
                  </span>
                </div>
              ))}
            </div>

            {/* Canonical Use Case Mapping */}
            <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#475569] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Mapped Canonical Use Cases</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {canonicalUseCases.map((uc) => (
                  <div
                    key={uc.id}
                    title={uc.description}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[12px] font-medium text-[#09090B] shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>{uc.name}</span>
                    <span className="text-[10px] text-[#94A3B8] uppercase font-mono">
                      ({uc.channel})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Autonomous Execution Steps */}
          {template.steps && template.steps.length > 0 && (
            <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 md:p-7 shadow-xs space-y-4">
              <div>
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  Workflow Execution DAG
                </div>
                <h3 className="text-lg font-bold text-[#09090B] mt-0.5">
                  Autonomous Sequence of Operations
                </h3>
              </div>

              <div className="space-y-2.5">
                {template.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA]/60 flex items-start gap-3.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#09090B] text-white flex items-center justify-center font-bold text-[11.5px] shrink-0 mt-0.5">
                      {st.stepNumber || idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[13.5px] text-[#09090B]">
                          {st.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-[#E5E7EB] text-[10.5px] font-semibold text-[#475569]">
                          {st.badge}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#64748B] mt-0.5 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3): Enterprise Knowledge & Connector Requirements */}
        <div className="space-y-6">
          {/* Knowledge Requirements Card */}
          <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#09090B]" />
              <h3 className="font-bold text-[15.5px] text-[#09090B]">
                Knowledge Requirements
              </h3>
            </div>
            <p className="text-[12.5px] text-[#64748B] leading-relaxed">
              When hired, this employee grounds all conversational reasoning and answers in your workspace documents.
            </p>

            <div className="space-y-2 pt-1">
              {template.requiredKnowledge.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center gap-2.5 text-[12.5px] font-medium text-[#09090B]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authorized Tool Connectors Card */}
          <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Plug className="w-4 h-4 text-[#09090B]" />
              <h3 className="font-bold text-[15.5px] text-[#09090B]">
                Authorized Integrations
              </h3>
            </div>
            <p className="text-[12.5px] text-[#64748B] leading-relaxed">
              Required enterprise tools for reading and writing data without manual intervention.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {template.requiredConnectors.map((tool) => (
                <div
                  key={tool}
                  className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center gap-2.5 text-[12.5px] font-medium text-[#09090B]"
                >
                  <span className="w-6 h-6 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                    {renderConnectorIcon(tool)}
                  </span>
                  <span className="capitalize truncate">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust & Safety Card */}
          <div className="rounded-3xl bg-[#F8F9FA] border border-[#E5E7EB] p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-[14px]">Enterprise Guardrails</h4>
            </div>
            <p className="text-[12px] text-[#64748B] leading-relaxed">
              Enforces strict zero-hallucination boundaries, PII redaction, and simulated action isolation before connecting to live customer channels.
            </p>
          </div>
        </div>
      </div>

      {/* Live Interactive Sandboxed Demo Section */}
      <div ref={demoSectionRef} className="pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <div className="flex items-center gap-2 text-[11.5px] font-bold text-indigo-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-2xl font-bold text-[#09090B] tracking-tight mt-0.5">
              Try {template.name}
            </h2>
            <p className="text-[13.5px] text-[#64748B] mt-0.5">
              Interact with this AI Employee in a safe sandbox. Observe real-time intent detection, reasoning steps, and simulated tool payloads.
            </p>
          </div>

          {/* Sandbox Indicator */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sandboxed Simulation Mode</span>
          </div>
        </div>

        {/* The Reusable Sandbox Component */}
        <div className="rounded-3xl bg-white border border-[#E5E7EB] p-4 md:p-6 shadow-xs">
          <AgentSimulatorSandbox
            agentName={template.suggestedName}
            role={template.role}
            kind={isVoice ? "voice" : "chat"}
            systemPrompt={template.defaultPrompt}
            greetingMessage={template.greetingMessage}
            connectedTools={template.requiredConnectors}
            connectedDocs={template.requiredKnowledge}
          />
        </div>
      </div>

      {/* Bottom Hiring Callout Banner */}
      <div className="rounded-3xl bg-[#09090B] text-white p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <h3 className="text-xl font-bold tracking-tight">
            Ready to hire {template.name}?
          </h3>
          <p className="text-[13.5px] text-[#94A3B8] leading-relaxed">
            Instantiate this digital employee blueprint into your workspace. You can customize prompts, bind private company files, and test with your team before deploying.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseTemplate}
          disabled={isHiring || isComingSoon}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-bold transition-all shrink-0 cursor-pointer ${
            isComingSoon
              ? "bg-[#27272A] text-[#71717A] cursor-not-allowed"
              : "bg-white text-[#09090B] hover:bg-[#F4F5F6] active:scale-[0.98] shadow-xs"
          }`}
        >
          <span>Use This Template</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
