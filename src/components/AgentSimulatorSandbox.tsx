import { useState, useRef, useEffect } from "react";
import * as I from "./icons";
import { renderConnectorIcon } from "./renderConnectorIcon";

interface AgentSimulatorSandboxProps {
  agentName: string;
  role: string;
  kind?: "chat" | "voice" | "hybrid";
  systemPrompt?: string;
  greetingMessage?: string;
  connectedTools?: string[];
  connectedDocs?: string[];
}

interface SimMessage {
  id: string;
  role: "visitor" | "agent";
  content: string;
  timestamp: string;
  toolCall?: {
    tool: string;
    action: string;
    payload: Record<string, any>;
    status: string;
  };
  reasoningSteps?: string[];
  groundingDoc?: string;
}

export function AgentSimulatorSandbox({
  agentName,
  role,
  kind: _kind = "chat",
  systemPrompt: _systemPrompt = "",
  greetingMessage = "Hello! How can I assist you with your business needs today?",
  connectedTools = ["salesforce", "gmail", "slack"],
  connectedDocs = ["Enterprise Pricing Guide.pdf", "Product Architecture Whitepaper.md"]
}: AgentSimulatorSandboxProps) {
  const [messages, setMessages] = useState<SimMessage[]>([
    {
      id: "msg-0",
      role: "agent",
      content: greetingMessage || "Hello! How can I assist you today?",
      timestamp: "Just now",
      reasoningSteps: ["Loaded system instructions", "Grounded in 2 verified documents", "Ready to capture requirements"]
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 30, 60, 80, 45, 20]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Animate audio waveform when voice is active
  useEffect(() => {
    if (!isVoiceActive) return;
    const interval = setInterval(() => {
      setAudioLevel([
        Math.floor(Math.random() * 60) + 20,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 95) + 10,
        Math.floor(Math.random() * 85) + 25,
        Math.floor(Math.random() * 70) + 15,
        Math.floor(Math.random() * 50) + 10
      ]);
    }, 120);
    return () => clearInterval(interval);
  }, [isVoiceActive]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: SimMessage = {
      id: `msg-${Date.now()}`,
      role: "visitor",
      content: text,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsThinking(true);

    // Simulated autonomous agent response with reasoning and tool execution
    setTimeout(() => {
      setIsThinking(false);
      let agentReply = "Thank you for sharing your requirements! I have logged your details and verified our enterprise architecture specs.";
      let toolCall: SimMessage["toolCall"] = undefined;
      const lower = text.toLowerCase();

      if (lower.includes("demo") || lower.includes("price") || lower.includes("seat") || lower.includes("cost") || lower.includes("enterprise")) {
        agentReply = `I have logged your interest in our enterprise plan with sub-400ms voice agents and native CRM sync. I've automatically dispatched an architecture guide to your team and created an opportunity in Salesforce.`;
        toolCall = {
          tool: "salesforce",
          action: "create_lead",
          payload: {
            Company: "Visitor Company",
            LeadSource: "KaliGan AI Simulation",
            Status: "Qualified",
            Score: 92,
            Notes: text
          },
          status: "SUCCESS · 240ms"
        };
      } else if (lower.includes("appointment") || lower.includes("doctor") || lower.includes("book") || lower.includes("clinic")) {
        agentReply = `I have checked the calendar availability and confirmed your appointment slot. Confirmation code #RN-8942 has been generated and synced with Google Calendar.`;
        toolCall = {
          tool: "calendar",
          action: "schedule_appointment",
          payload: {
            Organization: "ReceiptNest Health",
            Doctor: "Dr. Eleanor Harrison",
            Slot: "Thursday 2:30 PM",
            Status: "CONFIRMED"
          },
          status: "SUCCESS · 190ms"
        };
      } else if (lower.includes("issue") || lower.includes("bug") || lower.includes("billing") || lower.includes("broken")) {
        agentReply = `I have categorized your issue as High Priority and created support ticket #TICK-44910 with our engineering escalation team.`;
        toolCall = {
          tool: "zendesk",
          action: "create_support_ticket",
          payload: {
            Priority: "HIGH",
            Category: "Technical Diagnostics",
            Summary: text
          },
          status: "SUCCESS · 210ms"
        };
      }

      const replyMsg: SimMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "agent",
        content: agentReply,
        timestamp: "Just now",
        toolCall,
        reasoningSteps: [
          `Retrieved 2 vector chunks from "${connectedDocs[0] || 'KnowledgeBase'}"`,
          `Analyzed user intent: "${text.slice(0, 30)}..."`,
          toolCall ? `Selected and executed tool action: ${toolCall.tool}.${toolCall.action}` : `Generated natural grounded response`
        ],
        groundingDoc: connectedDocs[0]
      };

      setMessages(prev => [...prev, replyMsg]);
    }, 900);
  };

  const loadScenario = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadein">
      {/* Left Column: Interactive Chat & Voice UI */}
      <div className="lg:col-span-7 flex flex-col h-[640px] rounded-[var(--g-radius-xl)] border border-[var(--g-border)] bg-[var(--g-surface)] overflow-hidden shadow-xs">
        {/* Sandbox Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--g-border-light)] bg-[var(--g-surface)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[var(--g-foreground)] text-[var(--g-background)] flex items-center justify-center font-bold text-[13px]">
                {agentName.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[14.5px] text-[var(--g-foreground)]">{agentName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase">
                  Simulator Active
                </span>
              </div>
              <p className="text-[12px] text-[var(--g-muted-foreground)] truncate max-w-[280px]">{role}</p>
            </div>
          </div>

          {/* Voice Mode Toggle */}
          <button
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isVoiceActive
                ? "bg-rose-500 text-white shadow-xs animate-pulse"
                : "bg-[var(--g-secondary)] text-[var(--g-foreground)] hover:bg-[var(--g-border-light)]"
            }`}
          >
            <I.Phone width={13} height={13} />
            <span>{isVoiceActive ? "End Audio Stream" : "Start Voice Call"}</span>
          </button>
        </div>

        {/* Voice Audio Waveform Banner (When Voice is Active) */}
        {isVoiceActive && (
          <div className="px-5 py-3 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping" />
              <span className="text-[12.5px] font-semibold text-indigo-900">Gemini 2.5 Native Audio Preview · Sub-380ms</span>
            </div>
            <div className="flex items-center gap-1">
              {audioLevel.map((lvl, idx) => (
                <div
                  key={idx}
                  className="w-1.5 bg-indigo-600 rounded-full transition-all duration-75"
                  style={{ height: `${lvl * 0.28}px`, minHeight: "4px" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 g-no-scrollbar bg-[var(--g-background)]/50">
          {messages.map((m) => {
            const isVisitor = m.role === "visitor";
            return (
              <div key={m.id} className={`flex flex-col ${isVisitor ? "items-end" : "items-start"}`}>
                <div className="text-[11px] text-[var(--g-muted-foreground)] mb-1 px-1">
                  {isVisitor ? "You (Visitor)" : agentName} · {m.timestamp}
                </div>
                <div
                  className={`p-3.5 rounded-[14px] text-[13.5px] leading-relaxed max-w-[85%] border shadow-2xs ${
                    isVisitor
                      ? "bg-[var(--g-foreground)] text-[var(--g-background)] border-transparent rounded-tr-xs"
                      : "bg-[var(--g-surface)] text-[var(--g-foreground)] border-[var(--g-border)] rounded-tl-xs"
                  }`}
                >
                  {m.content}
                </div>

                {/* Inline Tool Execution Chip (For Agent Responses) */}
                {m.toolCall && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-800 animate-fadein">
                    <span className="scale-75">{renderConnectorIcon(m.toolCall.tool)}</span>
                    <span>Executed <strong>{m.toolCall.tool}.{m.toolCall.action}</strong></span>
                    <span className="text-emerald-600 font-mono text-[10.5px]">({m.toolCall.status})</span>
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-[12.5px] text-[var(--g-muted-foreground)] italic">
              <span className="flex h-2 w-2 rounded-full bg-[var(--g-foreground)] animate-bounce" />
              <span>{agentName} is thinking &amp; searching grounding docs...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-[var(--g-border-light)] bg-[var(--g-surface)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={isVoiceActive ? "Speak into microphone or type..." : "Type a message to simulate conversation..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-4 py-2 text-[13.5px] rounded-full border border-[var(--g-border)] bg-[var(--g-background)] focus:outline-none focus:border-[var(--g-foreground)] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isThinking}
              className="px-4 py-2 rounded-full bg-[var(--g-foreground)] text-[var(--g-background)] font-medium text-[13px] hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <I.Send width={13} height={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: AI Reasoning Trace & Tool Payload Inspector */}
      <div className="lg:col-span-5 flex flex-col h-[640px] rounded-[var(--g-radius-xl)] border border-[var(--g-border)] bg-[var(--g-surface)] overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-[var(--g-border-light)] bg-[var(--g-surface)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <I.Bot width={16} height={16} className="text-[var(--g-foreground)]" />
            <h4 className="font-semibold text-[14.5px] text-[var(--g-foreground)]">Model Reasoning &amp; Tool Trace</h4>
          </div>
          <span className="text-[11px] font-mono text-[var(--g-muted-foreground)]">Live Inspector</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 g-no-scrollbar">
          {/* Quick Scenario Presets */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--g-muted-foreground)] mb-2">Simulate Quick Scenarios</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loadScenario("Hi, we are an enterprise with 50 seats looking for sub-400ms voice agents with Salesforce integration. What is the pricing?")}
                className="p-2.5 text-left text-[12px] font-medium rounded-lg border border-[var(--g-border-light)] bg-[var(--g-secondary)] hover:border-[var(--g-foreground)] transition-colors cursor-pointer"
              >
                🎯 50-Seat Enterprise Lead
              </button>
              <button
                onClick={() => loadScenario("I need to book an appointment with Dr. Harrison at Metro Health Clinic for Thursday afternoon.")}
                className="p-2.5 text-left text-[12px] font-medium rounded-lg border border-[var(--g-border-light)] bg-[var(--g-secondary)] hover:border-[var(--g-foreground)] transition-colors cursor-pointer"
              >
                📅 Doctor Appointment Booking
              </button>
              <button
                onClick={() => loadScenario("Our August invoice #INV-8891 has an incorrect charge for 15 unassigned seats. We need a refund.")}
                className="p-2.5 text-left text-[12px] font-medium rounded-lg border border-[var(--g-border-light)] bg-[var(--g-secondary)] hover:border-[var(--g-foreground)] transition-colors cursor-pointer"
              >
                🎫 Billing Ticket &amp; Refund
              </button>
              <button
                onClick={() => loadScenario("Can this bot tell me who won the 1994 World Cup?")}
                className="p-2.5 text-left text-[12px] font-medium rounded-lg border border-[var(--g-border-light)] bg-[var(--g-secondary)] hover:border-[var(--g-foreground)] transition-colors cursor-pointer"
              >
                🛡️ Out-of-Scope Guardrail Test
              </button>
            </div>
          </div>

          {/* Active Reasoning Trace */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--g-muted-foreground)] mb-2">Cognitive Reasoning Trace</div>
            <div className="p-3.5 rounded-lg bg-[var(--g-secondary)] border border-[var(--g-border-light)] space-y-2 text-[12.5px] text-[var(--g-foreground)]">
              {messages[messages.length - 1]?.reasoningSteps?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span className="leading-snug">{step}</span>
                </div>
              )) || (
                <div className="text-[var(--g-muted-foreground)] italic">Send a message to see the step-by-step reasoning DAG.</div>
              )}
            </div>
          </div>

          {/* Connected Grounding Docs */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--g-muted-foreground)] mb-2">Grounding Knowledge Sources</div>
            <div className="space-y-1.5">
              {connectedDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--g-border-light)] bg-[var(--g-surface)] text-[12.5px]">
                  <div className="flex items-center gap-2 truncate">
                    <I.FileText width={14} height={14} className="text-[var(--g-muted-foreground)] shrink-0" />
                    <span className="truncate text-[var(--g-foreground)] font-medium">{doc}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">Synced</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Enterprise Tools */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--g-muted-foreground)] mb-2">Authorized Tool Connectors</div>
            <div className="flex flex-wrap gap-2">
              {connectedTools.map((tool) => (
                <div key={tool} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] text-[12px] font-medium capitalize shadow-2xs">
                  <span className="scale-75">{renderConnectorIcon(tool)}</span>
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
