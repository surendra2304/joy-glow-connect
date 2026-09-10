import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  STUDIO_PRESETS,
  STUDIO_HERO_PROMPT_CARDS,
  STUDIO_SIDEBAR_DEFAULT_SECTIONS,
} from "../data/studioPresets";
import type { StudioPreset, SidebarDraftGroup, SidebarDraftItem } from "../data/studioPresets";
import { renderConnectorIcon } from "../components/renderConnectorIcon";
import { api } from "../lib/api";
import * as I from "../components/icons";
import {
  FileText,
  Mic,
  ArrowRight,
  Bot,
  Moon,
  Sparkles,
  Check,
  Send,
  Zap,
  ChevronDown,
  ChevronRight,
  Code2,
} from "lucide-react";

interface StudioChatMessage {
  id: string;
  role: "user" | "architect";
  content: string;
  timestamp: string;
  synthesizedEmployee?: StudioPreset;
}

interface ActiveSession {
  id: string;
  title: string;
  timestamp: string;
  messages: StudioChatMessage[];
  activeEmployee?: StudioPreset;
}

interface SandboxMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  toolCalls?: Array<{
    tool: string;
    action: string;
    payload: Record<string, unknown>;
  }>;
  citations?: string[];
  timestamp: string;
}

export default function AgentStudio() {
  const navigate = useNavigate();

  // Sidebar draft categories (initialized with canonical defaults)
  const [sidebarGroups, setSidebarGroups] = useState<SidebarDraftGroup[]>(() => {
    try {
      const saved = localStorage.getItem("kaligan_studio_draft_groups");
      return saved ? JSON.parse(saved) : STUDIO_SIDEBAR_DEFAULT_SECTIONS;
    } catch {
      return STUDIO_SIDEBAR_DEFAULT_SECTIONS;
    }
  });

  // Active chat session (null = initial hero state matching user screenshot)
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sandbox testing inside active session
  const [sandboxInput, setSandboxInput] = useState("");
  const [isSandboxThinking, setIsSandboxThinking] = useState(false);
  const [expandedReasoningId, setExpandedReasoningId] = useState<string | null>(null);
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null);
  const [sandboxMessages, setSandboxMessages] = useState<SandboxMessage[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync sidebar groups to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kaligan_studio_draft_groups", JSON.stringify(sidebarGroups));
    } catch {}
  }, [sidebarGroups]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isGenerating]);

  // Reset to initial empty state (matching screenshot)
  const handleNewEmployee = () => {
    setActiveSession(null);
    setInput("");
    setIsGenerating(false);
    setDeploySuccess(false);
    setSandboxMessages([]);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Helper: Find best matching preset based on user prompt keywords
  const inferPresetFromPrompt = (prompt: string): StudioPreset => {
    const p = prompt.toLowerCase();
    if (p.includes("support") || p.includes("ticket") || p.includes("help") || p.includes("issue") || p.includes("escalat")) {
      return STUDIO_PRESETS[1]; // Vedant - Support
    }
    if (p.includes("call") || p.includes("voice") || p.includes("reception") || p.includes("phone") || p.includes("schedule") || p.includes("appointment")) {
      return STUDIO_PRESETS[2]; // Vani - Voice
    }
    if (p.includes("churn") || p.includes("retention") || p.includes("cancel") || p.includes("stripe") || p.includes("billing")) {
      return STUDIO_PRESETS[3]; // Aarya - VIP Retention
    }
    return STUDIO_PRESETS[0]; // Maya - Sales Qualifier (Default)
  };

  // Select an item from the sidebar
  const handleSelectSidebarItem = (item: SidebarDraftItem) => {
    const matchedPreset = STUDIO_PRESETS.find((p) => p.id === item.presetId) || inferPresetFromPrompt(item.prompt);
    const session: ActiveSession = {
      id: item.id,
      title: item.title,
      timestamp: new Date().toISOString(),
      activeEmployee: matchedPreset,
      messages: [
        {
          id: `msg-${Date.now()}-u`,
          role: "user",
          content: item.prompt,
          timestamp: "Just now",
        },
        {
          id: `msg-${Date.now()}-a`,
          role: "architect",
          content: `I've configured your AI Employee **${matchedPreset.name}** to handle this workflow autonomously. It is pre-wired with enterprise connectors, sub-400ms voice/chat capability, and guardrails ready for deployment.`,
          timestamp: "Just now",
          synthesizedEmployee: matchedPreset,
        },
      ],
    };

    setActiveSession(session);
    setSandboxMessages([
      {
        id: "sb-init",
        role: "assistant",
        content: matchedPreset.greeting,
        timestamp: "Just now",
      },
    ]);
  };

  // Send a prompt from either the composer or the 3 prompt cards
  const handleSendPrompt = (promptText: string) => {
    const text = promptText.trim();
    if (!text) return;

    const matchedPreset = inferPresetFromPrompt(text);
    const title = text.length > 38 ? text.slice(0, 36) + "…" : text;

    // Create a new session
    const sessionId = `draft-${Date.now()}`;
    const newDraftItem: SidebarDraftItem = {
      id: sessionId,
      title,
      prompt: text,
      presetId: matchedPreset.id,
    };

    // Add to TODAY in sidebar
    setSidebarGroups((prev) =>
      prev.map((group) =>
        group.id === "today"
          ? { ...group, items: [newDraftItem, ...group.items.filter((i) => i.prompt !== text)] }
          : group
      )
    );

    const userMsg: StudioChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: "user",
      content: text,
      timestamp: "Just now",
    };

    const newSession: ActiveSession = {
      id: sessionId,
      title,
      timestamp: new Date().toISOString(),
      activeEmployee: matchedPreset,
      messages: [userMsg],
    };

    setActiveSession(newSession);
    setInput("");
    setIsGenerating(true);

    // Simulate AI synthesis
    setTimeout(() => {
      const architectMsg: StudioChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: "architect",
        content: `I've analyzed your requirements for: **"${text}"**.\n\nSynthesized **${matchedPreset.name}** (${matchedPreset.role}).\nAutonomous tool execution is enabled for **${matchedPreset.tools.join(", ")}**, with conversational guardrails and sub-400ms response latency.`,
        timestamp: "Just now",
        synthesizedEmployee: matchedPreset,
      };

      setActiveSession((curr) =>
        curr
          ? {
              ...curr,
              messages: [...curr.messages, architectMsg],
            }
          : null
      );

      setSandboxMessages([
        {
          id: "sb-init",
          role: "assistant",
          content: matchedPreset.greeting,
          timestamp: "Just now",
        },
      ]);

      setIsGenerating(false);
    }, 700);
  };

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt(input);
    }
  };

  // Test chat in the sandbox
  const handleSendSandboxMessage = (query: string) => {
    if (!query.trim() || isSandboxThinking || !activeSession?.activeEmployee) return;

    const userMsg: SandboxMessage = {
      id: `sb-u-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: "Just now",
    };

    setSandboxMessages((prev) => [...prev, userMsg]);
    setSandboxInput("");
    setIsSandboxThinking(true);

    const emp = activeSession.activeEmployee;

    setTimeout(() => {
      const assistantMsg: SandboxMessage = {
        id: `sb-a-${Date.now()}`,
        role: "assistant",
        content: `I've verified the details and processed the request seamlessly. All contact details and status flags have been synchronized with your connected workspace tools.`,
        reasoning: `1. Analyzed incoming inquiry against policy threshold.\n2. Inferred intent: verified requirements for ${emp.role}.\n3. Dispatched enterprise tool actions with validated JSON parameters.\n4. Formulated response with sub-400ms response cadence.`,
        toolCalls: [
          {
            tool: emp.tools[0] || "salesforce",
            action: emp.toolActions[emp.tools[0]]?.[0] || "create_lead",
            payload: {
              account_tier: "Enterprise",
              status: "Qualified",
              response_time_ms: 210,
              verified: true,
            },
          },
        ],
        citations: emp.knowledgeTopics.slice(0, 2),
        timestamp: "Just now",
      };

      setSandboxMessages((prev) => [...prev, assistantMsg]);
      setIsSandboxThinking(false);
    }, 850);
  };

  // Deploy synthesized AI Employee directly to PostgreSQL workforce
  const handleDeployToWorkforce = async (employee: StudioPreset) => {
    setIsDeploying(true);
    try {
      const res = await api.post("/agents", {
        name: employee.name,
        role: employee.role,
        description: employee.description,
        kind: employee.kind,
        systemPrompt: employee.systemPrompt,
        model: "claude-3-5-sonnet",
        tools: employee.tools,
        voiceName: employee.voiceName,
        speakingSpeed: employee.speakingSpeed,
        isVoiceEnabled: employee.kind === "voice" || employee.kind === "hybrid",
        isTemplate: false,
      });

      const newAgentId = res.data?.data?.id || res.data?.id;
      setDeploySuccess(true);
      setTimeout(() => {
        if (newAgentId) {
          navigate(`/app/agents/${newAgentId}`);
        } else {
          navigate("/app/agents");
        }
      }, 900);
    } catch (err: unknown) {
      console.error("Failed to deploy agent to workforce:", err);
      navigate("/app/agents");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden bg-white text-zinc-900 select-text ${isDarkMode ? "dark" : ""}`}>
      {/* ─────────────────────────────────────────────────────────────
          1. TOP HEADER (Exact match to reference screenshot)
          KaliGanAI  |  Employee Studio               + New Chat   ← Exit Studio
      ───────────────────────────────────────────────────────────── */}
      <header className="h-[56px] border-b border-zinc-200/80 bg-white px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/app" className="flex items-center gap-2.5 group">
            <I.Logo className="w-5 h-5 text-zinc-900 shrink-0" />
            <span className="text-[14px] font-bold tracking-tight text-zinc-900">KaliGanAI</span>
          </Link>
          <span className="text-zinc-300 font-light text-[15px] select-none">|</span>
          <span className="text-[13.5px] font-medium text-zinc-800">Employee Studio</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleNewEmployee}
            className="px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <I.Plus width={12} height={12} />
            <span>New Chat</span>
          </button>
          <Link
            to="/app/agents"
            className="px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <I.ArrowLeft width={12} height={12} />
            <span>Exit Studio</span>
          </Link>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. BODY (Left Sidebar + Center Canvas)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* LEFT SIDEBAR (Exact match: + New Employee button, TODAY, YESTERDAY, PREVIOUS 7 DAYS) */}
        <aside className="w-[250px] shrink-0 border-r border-zinc-100 bg-white flex flex-col p-4 overflow-y-auto">
          {/* + New Employee Button */}
          <button
            onClick={handleNewEmployee}
            className="w-full rounded-xl bg-[#f4f4f5] hover:bg-[#e4e4e7] text-zinc-900 text-[13px] font-medium px-4 py-2.5 flex items-center gap-2 transition-colors cursor-pointer mb-5"
          >
            <I.Plus width={14} height={14} className="text-zinc-700" />
            <span>New Employee</span>
          </button>

          {/* Categorized Drafts */}
          <div className="flex-1 flex flex-col gap-5">
            {sidebarGroups.map((group) => (
              <div key={group.id}>
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-1">
                  {group.title}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const isActive = activeSession?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSidebarItem(item)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[13px] transition-colors truncate block cursor-pointer ${
                          isActive
                            ? "bg-zinc-100 text-zinc-900 font-medium"
                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                        title={item.title}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER MAIN CANVAS */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto w-full flex flex-col items-center justify-center p-6">
            {!activeSession ? (
              /* ─────────────────────────────────────────────────────────────
                  EMPTY / INITIAL STATE (Exact match to reference screenshot)
                  Build an AI Employee
                  Describe what you want your AI employee to do.
                  [ Card 1 ]
                  [ Card 2 ]
                  [ Card 3 ]
              ───────────────────────────────────────────────────────────── */
              <div className="w-full max-w-[660px] flex flex-col items-center justify-center my-auto py-8">
                <h1 className="text-[32px] sm:text-[36px] font-semibold text-zinc-900 tracking-tight text-center">
                  Build an AI Employee
                </h1>
                <p className="text-[14.5px] text-zinc-500 text-center mt-2 mb-10">
                  Describe what you want your AI employee to do.
                </p>

                {/* 3 Large Prompt Cards */}
                <div className="w-full flex flex-col gap-3.5">
                  {STUDIO_HERO_PROMPT_CARDS.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(promptText)}
                      className="w-full rounded-2xl border border-zinc-100 bg-white p-5 text-left text-[13.5px] text-zinc-600 leading-relaxed shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-zinc-200 hover:shadow-xs hover:text-zinc-900 transition-all cursor-pointer group"
                    >
                      "{promptText}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ─────────────────────────────────────────────────────────────
                  ACTIVE CONVERSATION & EMPLOYEE WORKFLOW VIEW
              ───────────────────────────────────────────────────────────── */
              <div className="w-full max-w-3xl flex flex-col gap-6 py-6 my-auto">
                {activeSession.messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-3">
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="bg-zinc-100 text-zinc-900 px-4 py-2.5 rounded-2xl max-w-[85%] text-[14px] leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-[14px] text-zinc-800 leading-relaxed pt-0.5 space-y-3">
                            <p className="whitespace-pre-line">{msg.content}</p>

                            {/* Synthesized Employee Card & Live Test Sandbox */}
                            {msg.synthesizedEmployee && (
                              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs mt-3 space-y-4">
                                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-xl shadow-2xs">
                                      🤖
                                    </div>
                                    <div>
                                      <div className="text-[14px] font-semibold text-zinc-900">
                                        {msg.synthesizedEmployee.name}
                                      </div>
                                      <div className="text-[12px] text-zinc-500">
                                        {msg.synthesizedEmployee.role}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeployToWorkforce(msg.synthesizedEmployee!)}
                                    disabled={isDeploying || deploySuccess}
                                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-[12.5px] font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                  >
                                    {isDeploying ? (
                                      <>
                                        <I.Logo className="w-3.5 h-3.5 animate-spin text-white" />
                                        <span>Deploying...</span>
                                      </>
                                    ) : deploySuccess ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Deployed!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                        <span>Deploy to Workforce</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                {/* Bound Tools */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11.5px] font-medium text-zinc-400 mr-1">
                                    Bound Connectors:
                                  </span>
                                  {msg.synthesizedEmployee.tools.map((toolId) => (
                                    <span
                                      key={toolId}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200/80 text-[11.5px] font-medium text-zinc-700"
                                    >
                                      {renderConnectorIcon(toolId, "w-3.5 h-3.5")}
                                      <span className="capitalize">{toolId}</span>
                                    </span>
                                  ))}
                                </div>

                                {/* Mini Live Sandbox Simulator */}
                                <div className="rounded-xl border border-zinc-150 bg-zinc-50/70 p-3.5 space-y-3">
                                  <div className="flex items-center justify-between text-[11.5px] font-semibold text-zinc-500 uppercase tracking-wider">
                                    <span>Live Sandbox Simulator</span>
                                    <span className="text-emerald-600 font-normal">Active & Ready</span>
                                  </div>

                                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                                    {sandboxMessages.map((sbMsg) => (
                                      <div
                                        key={sbMsg.id}
                                        className={`flex flex-col ${
                                          sbMsg.role === "user" ? "items-end" : "items-start"
                                        }`}
                                      >
                                        <div
                                          className={`px-3 py-2 rounded-xl text-[13px] max-w-[90%] leading-relaxed ${
                                            sbMsg.role === "user"
                                              ? "bg-zinc-900 text-white"
                                              : "bg-white border border-zinc-200 text-zinc-800 shadow-2xs"
                                          }`}
                                        >
                                          {sbMsg.content}
                                        </div>

                                        {/* Expandable Reasoning Trace */}
                                        {sbMsg.reasoning && (
                                          <div className="mt-1 max-w-[90%]">
                                            <button
                                              onClick={() =>
                                                setExpandedReasoningId(
                                                  expandedReasoningId === sbMsg.id ? null : sbMsg.id
                                                )
                                              }
                                              className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
                                            >
                                              <Zap className="w-3 h-3 text-amber-500" />
                                              <span>
                                                {expandedReasoningId === sbMsg.id ? "Hide" : "View"} Chain of Thought
                                              </span>
                                              <ChevronDown
                                                className={`w-3 h-3 transition-transform ${
                                                  expandedReasoningId === sbMsg.id ? "rotate-180" : ""
                                                }`}
                                              />
                                            </button>
                                            {expandedReasoningId === sbMsg.id && (
                                              <div className="mt-1 p-2 rounded-lg bg-white border border-zinc-200 text-[11.5px] text-zinc-600 whitespace-pre-line leading-relaxed font-mono">
                                                {sbMsg.reasoning}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* Executed Tools Telemetry */}
                                        {sbMsg.toolCalls && sbMsg.toolCalls.length > 0 && (
                                          <div className="mt-1 max-w-[90%]">
                                            <button
                                              onClick={() =>
                                                setExpandedPayloadId(
                                                  expandedPayloadId === sbMsg.id ? null : sbMsg.id
                                                )
                                              }
                                              className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
                                            >
                                              <Code2 className="w-3 h-3 text-blue-500" />
                                              <span>Executed Tool: {sbMsg.toolCalls[0].action}</span>
                                              <ChevronRight
                                                className={`w-3 h-3 transition-transform ${
                                                  expandedPayloadId === sbMsg.id ? "rotate-90" : ""
                                                }`}
                                              />
                                            </button>
                                            {expandedPayloadId === sbMsg.id && (
                                              <pre className="mt-1 p-2 rounded-lg bg-zinc-900 text-zinc-200 text-[10.5px] font-mono overflow-x-auto">
                                                {JSON.stringify(sbMsg.toolCalls[0].payload, null, 2)}
                                              </pre>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}

                                    {isSandboxThinking && (
                                      <div className="text-[12px] text-zinc-400 italic flex items-center gap-1.5">
                                        <I.Logo className="w-3 h-3 animate-spin" />
                                        <span>Employee is thinking...</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Sandbox mini input */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <input
                                      type="text"
                                      value={sandboxInput}
                                      onChange={(e) => setSandboxInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSendSandboxMessage(sandboxInput);
                                      }}
                                      placeholder="Test a question or prompt with your AI employee..."
                                      className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-[13px] text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors"
                                    />
                                    <button
                                      onClick={() => handleSendSandboxMessage(sandboxInput)}
                                      disabled={!sandboxInput.trim() || isSandboxThinking}
                                      className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-black text-white text-[12.5px] font-medium cursor-pointer transition-colors disabled:opacity-40"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isGenerating && (
                  <div className="flex items-center gap-2 text-zinc-400 text-[13px] pt-2">
                    <I.Logo className="w-4 h-4 animate-spin text-zinc-800" />
                    <span>Synthesizing autonomous AI employee specifications...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. BOTTOM FLOATING COMPOSER (Exact match to reference screenshot)
              [ FileText  Mic ]               [ GreenBotBadge   ArrowCircle ]
              "AI Employees can make mistakes. Review generated workflows before deploying."
          ───────────────────────────────────────────────────────────── */}
          <div className="w-full shrink-0 px-4 pb-4 pt-2 bg-white relative z-20">
            <div className="max-w-[720px] mx-auto w-full">
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs p-3.5 focus-within:border-zinc-400 focus-within:shadow-sm transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the employee you want to build..."
                  rows={input.split("\n").length > 1 ? Math.min(input.split("\n").length, 5) : 1}
                  className="w-full min-h-[44px] max-h-[140px] resize-none border-none outline-none bg-transparent text-[14px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 block"
                />

                <div className="flex items-center justify-between pt-2">
                  {/* Left icons: File / Document and Mic */}
                  <div className="flex items-center gap-3 text-zinc-400">
                    <button
                      type="button"
                      title="Attach documents"
                      className="hover:text-zinc-600 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Voice prompt"
                      className="hover:text-zinc-600 transition-colors cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: Green Bot Avatar Badge + Circular Submit Button */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-2xs cursor-pointer"
                      title="KaliGan Autonomous Architect"
                    >
                      <Bot className="w-3 h-3 text-white" />
                    </div>

                    <button
                      type="button"
                      disabled={!input.trim() || isGenerating}
                      onClick={() => handleSendPrompt(input)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        input.trim() && !isGenerating
                          ? "bg-zinc-900 text-white hover:scale-105 shadow-xs"
                          : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                      }`}
                      title="Send message"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtitle disclaimer */}
              <p className="text-[11.5px] text-zinc-400 text-center mt-2 tracking-normal">
                AI Employees can make mistakes. Review generated workflows before deploying.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. FLOATING UTILITIES (Dark Mode button & right edge panel handle)
      ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 right-6 w-9 h-9 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-all cursor-pointer z-30"
        title="Toggle dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <div
        className="fixed right-0 bottom-24 bg-white border border-r-0 border-zinc-200 px-1 py-2 rounded-l-md text-zinc-400 hover:text-zinc-600 cursor-pointer shadow-2xs z-30 text-[10px] select-none font-mono flex items-center justify-center"
        title="Panel controls"
      >
        &gt;.&lt;
      </div>
    </div>
  );
}
