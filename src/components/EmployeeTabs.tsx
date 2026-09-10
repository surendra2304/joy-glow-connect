import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { GPill, GSectionCard, GStat, GStatRow, GTable, GTd, GSpinner, GField } from "./grok";
import * as I from "./icons";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { formatDate, parseList, parseObj } from "../lib/utils";
import { getCached } from "../lib/cache";
import { PERSONAS, GOALS, VOICES, CAPTURE_FIELDS, LANGUAGES, SPEAKING_SPEEDS } from "../lib/agentConstants";
import { Orb } from "./voice/Orb";
import { useLiveSession, ConnectionState } from "../lib/voice/useLiveSession";
import type { Agent } from "../types/agent";
import type { Conversation, Message } from "../types/conversation";
import type { Call } from "../types/call";
import type { Lead } from "../types/lead";



export function PersonaTab({ agent, updateField }: { agent: Agent; updateField: (k: keyof Agent, v: unknown) => void }) {
  const isVoice = agent.kind === "voice";
  const captureFields = parseList(agent.captureFields);
  const toggleCapture = (f: string) => {
    const next = captureFields.includes(f) ? captureFields.filter((x) => x !== f) : [...captureFields, f];
    updateField("captureFields", next);
  };
  return (
    <GSectionCard title="Persona & Prompt" description="Identity, tone and what every conversation should achieve.">
      <div className="px-5 pb-5 flex flex-col gap-5 max-w-2xl">
        <GField label="Employee name">
          <input className="g-input" value={agent.name || ""} onChange={(e) => updateField("name", e.target.value)} />
        </GField>
        <GField label="Greeting" hint="First message the employee sends — on the widget or when a call connects.">
          <textarea className="g-input min-h-[80px] resize-y" value={agent.greeting || ""} onChange={(e) => updateField("greeting", e.target.value)} />
        </GField>
        <div>
          <span className="g-label-xs block mb-2 font-semibold">Personality</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PERSONAS.map((p) => (
              <button key={p} onClick={() => updateField("persona", p)}
                className={`border rounded-grok px-3 py-2.5 text-[13px] transition ${
                  agent.persona === p
                    ? "border-[var(--g-foreground)] bg-[var(--g-secondary)] font-semibold text-[var(--g-foreground)]"
                    : "border-[var(--g-border)] hover:border-[var(--g-foreground)] text-[var(--g-foreground)]"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="g-label-xs block mb-2 font-semibold">Primary goal</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GOALS.map((g) => (
              <button key={g.id} onClick={() => updateField("goal", g.id)}
                className={`border rounded-grok px-3 py-2.5 text-[13px] transition ${
                  agent.goal === g.id
                    ? "border-[var(--g-foreground)] bg-[var(--g-secondary)] font-semibold text-[var(--g-foreground)]"
                    : "border-[var(--g-border)] hover:border-[var(--g-foreground)] text-[var(--g-foreground)]"
                }`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
        {isVoice && (
          <>
            <div>
              <span className="g-label-xs block mb-2 font-semibold">Voice</span>
              <div className="grid grid-cols-3 gap-2">
                {VOICES.map((v) => (
                  <button key={v.id} onClick={() => updateField("voiceName", v.id)}
                    className={`border rounded-grok px-3 py-3 text-left transition ${
                      (agent.voiceName || "aria") === v.id
                        ? "border-[var(--g-foreground)] bg-[var(--g-secondary)]"
                        : "border-[var(--g-border)] hover:border-[var(--g-foreground)]"
                    }`}>
                    <span className="block text-[13px] font-medium text-[var(--g-foreground)]">{v.name}</span>
                    <span className="block text-[11.5px] mt-0.5" style={{ color: "var(--g-muted-foreground)" }}>{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GField label="Language">
                <select className="g-input" value={agent.language || "en-US"} onChange={(e) => updateField("language", e.target.value)}>
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </GField>
              <GField label="Speaking speed">
                <select className="g-input" value={agent.speakingSpeed || "natural"} onChange={(e) => updateField("speakingSpeed", e.target.value)}>
                  {SPEAKING_SPEEDS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </GField>
            </div>
          </>
        )}
        <div>
          <span className="g-label-xs block mb-2 font-semibold">Capture fields</span>
          <div className="flex gap-2">
            {CAPTURE_FIELDS.map((f) => {
              const active = captureFields.includes(f);
              return (
                <button key={f} onClick={() => toggleCapture(f)}
                  className={`border rounded-full px-3.5 py-1.5 text-[12.5px] transition ${
                    active
                      ? "border-[var(--g-foreground)] bg-[var(--g-secondary)] font-medium text-[var(--g-foreground)]"
                      : "border-[var(--g-border)] hover:border-[var(--g-foreground)] text-[var(--g-muted-foreground)]"
                  }`}>
                  {active ? "✓ " : "+ "}{f}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GSectionCard>
  );
}

export function KnowledgeTab({ agent, documents, toggleDoc }: { agent: Agent; documents: any[]; toggleDoc: (id: string) => void }) {
  const connected = parseList(agent.connectedKbDocumentIds);
  return (
    <GSectionCard
      title="Knowledge Sources"
      description="Connect company documents, FAQs and website URLs for this employee to answer accurately."
      action={<Link to="/app/knowledge" className="g-btn-2">Manage library</Link>}
    >
      <div className="px-5 pb-5">
        {documents.length === 0 ? (
          <p className="text-[13px] py-4" style={{ color: "var(--g-muted-foreground)" }}>
            No documents uploaded to your workspace yet. <Link to="/app/knowledge" className="underline font-medium">Add documents</Link> to train your employee.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {documents.map((d) => {
              const on = connected.includes(d.id);
              return (
                <div key={d.id} className="flex items-center justify-between p-3.5 border rounded-grok transition hover:border-[var(--g-border-strong)]"
                  style={{ background: "var(--g-surface)", borderColor: "var(--g-border)" }}>
                  <div className="min-w-0 flex items-center gap-3">
                    <I.Book width={16} height={16} className="text-[var(--g-muted-foreground)]" />
                    <div>
                      <div className="text-[13.5px] font-medium truncate text-[var(--g-foreground)]">{d.name}</div>
                      <div className="g-mono text-[11.5px] mt-0.5" style={{ color: "var(--g-muted-foreground)" }}>
                        {d.type.toUpperCase()} · {d.chunkCount} indexed passages · {d.status}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => toggleDoc(d.id)}
                    className={on ? "g-btn-2 text-[12px]" : "g-btn text-[12px]"}>
                    {on ? "Disconnect" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GSectionCard>
  );
}

export function ChannelsTab({ agent, updateField, id, onChanged }: {
  agent: Agent; updateField: (k: keyof Agent, v: unknown) => void; id: string; onChanged: () => void;
}) {
  const { workspace } = useAuth();
  const channels = parseObj(agent.channels);
  const isVoice = agent.kind === "voice";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [phoneNotice, setPhoneNotice] = useState<string | null>(null);

  const toggle = (k: string) => updateField("channels", { ...channels, [k]: !channels[k] });

  const handleConnectPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setConnecting(true);
    setPhoneNotice(null);
    try {
      const res = await api.post("/telephony/numbers/connect", { agentId: id, phoneE164: phoneNumber });
      if (res && res.agentToken) {
        await api.post("/telephony/numbers/verify", { agentToken: res.agentToken });
        setPhoneNotice(`Connected ${phoneNumber} to ${agent.name} successfully!`);
        setPhoneNumber("");
        onChanged();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setPhoneNotice(`Error: ${error.message || "Failed to connect phone number"}`);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <GSectionCard title="Channels" description="Where customers interact with this employee.">
        <div className="px-5 pb-5 flex flex-col gap-3">
          <label className="flex items-center justify-between p-3.5 border rounded-grok cursor-pointer"
            style={{ background: "var(--g-surface)", borderColor: "var(--g-border)" }}>
            <div>
              <span className="text-[13.5px] font-medium block text-[var(--g-foreground)]">Website widget</span>
              <span className="text-[12px]" style={{ color: "var(--g-muted-foreground)" }}>Answer visitors on your site via embedded widget</span>
            </div>
            <input type="checkbox" checked={!!channels.web} onChange={() => toggle("web")} className="w-4 h-4 accent-[#0f0f0f]" />
          </label>
          <label className="flex items-center justify-between p-3.5 border rounded-grok cursor-pointer"
            style={{ background: "var(--g-surface)", borderColor: "var(--g-border)" }}>
            <div>
              <span className="text-[13.5px] font-medium block text-[var(--g-foreground)]">Inbound & outbound phone</span>
              <span className="text-[12px]" style={{ color: "var(--g-muted-foreground)" }}>Answer direct telephony calls with voice bridge</span>
            </div>
            <input type="checkbox" checked={!!channels.phone} onChange={() => toggle("phone")} className="w-4 h-4 accent-[#0f0f0f]" />
          </label>
        </div>
      </GSectionCard>

      {isVoice && (
        <GSectionCard title="Direct Phone Number Integration" description="Link a dedicated E.164 phone line directly to this voice employee.">
          <div className="p-5 flex flex-col gap-4 max-w-lg">
            {agent.phoneNumbers && agent.phoneNumbers.length > 0 ? (
              (() => {
                const conn = agent.phoneNumbers[0];
                const webhookUrl = `${window.location.origin}/api/v1/vobiz/incoming?agentId=${id}&workspaceId=${workspace?.id}`;
                return (
                  <div className="space-y-3.5 text-[13px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">Connected number:</span>
                      <span className="font-display font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-mint-300 rounded-full">{conn.e164}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">Status:</span>
                      <span className={`font-bold px-2.5 py-0.5 rounded-full capitalize text-[11px] ${
                        conn.status === "connected" ? "bg-emerald-100 text-emerald-800" : "bg-[#fbf3df] text-warm animate-pulse"
                      }`}>
                        {conn.status}
                      </span>
                    </div>
                    <div className="border-t border-line/60 pt-3">
                      <label className="field-label !mb-1 text-ink font-semibold">Vobiz Webhook URL</label>
                      <div className="flex gap-2">
                        <input readOnly value={webhookUrl} className="g-input !bg-[var(--g-surface)] flex-1 text-[11.5px] font-mono select-all" />
                        <button onClick={() => {
                          navigator.clipboard.writeText(webhookUrl);
                          setPhoneNotice("Copied Webhook URL!");
                          setTimeout(() => setPhoneNotice(null), 2000);
                        }} className="g-btn-2 px-2.5 text-xs">Copy</button>
                      </div>
                      <small className="block text-[var(--g-muted-foreground)] text-[11.5px] mt-1.5 leading-relaxed">
                        In your Vobiz Console for this number, set the **Webhook URL** to this URL (HTTP POST).
                      </small>
                    </div>
                    {phoneNotice && (
                      <div className="text-[12.5px] p-3 rounded-grok bg-[var(--g-secondary)] text-[var(--g-foreground)] mt-2">
                        {phoneNotice}
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <form onSubmit={handleConnectPhone} className="flex flex-col gap-4">
                <GField label="Phone number (E.164 format)" hint="e.g. +14155552671 or +918012345678">
                  <input className="g-input g-mono" placeholder="+14155552671" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </GField>
                {phoneNotice && (
                  <div className="text-[12.5px] p-3 rounded-grok bg-[var(--g-secondary)] text-[var(--g-foreground)]">
                    {phoneNotice}
                  </div>
                )}
                <button type="submit" className="g-btn self-start" disabled={connecting}>
                  {connecting ? "Connecting line…" : "Connect phone line"}
                </button>
              </form>
            )}
          </div>
        </GSectionCard>
      )}

      <GSectionCard title="Website Widget Snippet" description={isVoice ? "Embed snippet to add a voice call button directly onto any webpage." : "Embed snippet to deploy this employee directly onto any webpage."}>
        <div className="px-5 pb-5">
          <pre className="p-4 rounded-grok g-mono text-[12px] overflow-x-auto leading-relaxed border bg-[var(--g-surface)]" style={{ borderColor: "var(--g-border)" }}>
{`<!-- KaliGanAI Employee Widget -->
<script
  src="${window.location.origin}/w.js"
  data-key="${workspace?.publicKey || "ws_..."}"
  data-agent="${agent.id}"
  async
></script>`}
          </pre>
        </div>
      </GSectionCard>
    </div>
  );
}

export function ChatTestPanel({ agent, onSessionCreated }: { agent: Agent; onSessionCreated?: () => void }) {
  const [msgs, setMsgs] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([{ role: "agent", content: agent.greeting || `Hi! I'm ${agent.name}. How can I help you today?` }]);
  }, [agent.greeting, agent.name, agent.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    const updated = [...msgs, { role: "visitor", content: text }];
    setMsgs(updated);
    try {
      const history = updated.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await api.post("/chat/preview", {
        agentId: agent.id,
        message: text,
        history,
      });
      setMsgs((prev) => [...prev, { role: "agent", content: res.reply }]);
      if (onSessionCreated) onSessionCreated();
    } catch (err: unknown) {
      const error = err as Error;
      setMsgs((prev) => [...prev, { role: "agent", content: error?.message || "Error: could not reach the model. Check GEMINI_API_KEY." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <GSectionCard title="Test & Simulate" description="Live interactive preview grounded in the employee's knowledge base.">
      <div className="px-5 pb-5">
        <div className="flex flex-col h-[420px] overflow-y-auto pr-1">
          {msgs.map((m, i) => {
            const visitor = m.role === "visitor";
            return (
              <div key={i} className={`max-w-[80%] mb-3 ${visitor ? "self-end text-right" : ""}`}>
                <div className={`inline-block text-left border rounded-grok px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  visitor ? "bg-[var(--g-secondary)] border-transparent text-[var(--g-foreground)]" : "bg-[var(--g-background)] border-[var(--g-border)] rounded-tl-none text-[var(--g-foreground)]"
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}
          {sending && (
            <div className="g-mono text-[11px] mb-3" style={{ color: "var(--g-muted-foreground)" }}>thinking…</div>
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="flex gap-2 mt-4">
          <input className="g-input flex-1" placeholder="Type a message to test…" value={input} onChange={(e) => setInput(e.target.value)} disabled={sending} />
          <button className="g-btn" disabled={sending || !input.trim()}>Send</button>
        </form>
      </div>
    </GSectionCard>
  );
}

export function VoiceTestPanel({ agentId, agentName, onSessionCreated }: { agentId: string; agentName: string; onSessionCreated?: () => void }) {
  const { connectionState, messages, error, isBotSpeaking, microphoneLevel, startSession, disconnect } = useLiveSession();
  const [orbLevel, setOrbLevel] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBotSpeaking) {
      const t = setInterval(() => setOrbLevel(0.15 + 0.45 * Math.sin(Date.now() / 80) * Math.random()), 50);
      return () => clearInterval(t);
    }
    setOrbLevel(microphoneLevel);
  }, [isBotSpeaking, microphoneLevel]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const live = connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING;

  const handleEndSession = async () => {
    disconnect();
    if (messages.length > 0) {
      try {
        await api.post("/voice/finalize", {
          agentId,
          transcript: messages.map((m: any) => ({
            role: m.role === "user" ? "visitor" : "agent",
            content: m.content,
          })),
          visitorMeta: { source: "voice_simulation" },
        });
        if (onSessionCreated) onSessionCreated();
      } catch (err) {
        console.error("Failed to finalize voice simulation", err);
      }
    }
  };

  return (
    <GSectionCard title="Test & Simulate" description={`Speak with ${agentName} using your microphone — live voice pipeline.`}>
      <div className="px-5 pb-5 flex flex-col items-center">
        <div className="h-[220px] grid place-items-center">
          <div className="w-[170px] h-[170px]">
            <Orb voiceLevel={orbLevel} className="w-full h-full" />
          </div>
        </div>
        <div className="g-label-xs mb-3">
          {connectionState === ConnectionState.CONNECTED ? "listening" : connectionState === ConnectionState.CONNECTING ? "connecting…" : error ? "error — try again" : "idle"}
        </div>
        <button className={live ? "g-btn-2" : "g-btn"} onClick={() => (live ? handleEndSession() : startSession(agentId))}>
          {live ? <><I.Pause width={13} height={13} /> End session</> : <><I.Play /> Talk to employee</>}
        </button>
        <div className="w-full mt-6 border-t pt-4" style={{ borderColor: "var(--g-border)" }}>
          <div className="g-label-xs mb-3">Transcript</div>
          <div className="flex flex-col max-h-[180px] overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="text-[12.5px]" style={{ color: "var(--g-muted-foreground)" }}>Start a session to see the live transcript.</div>
            )}
            {messages.map((m: any, i: number) => (
              <div key={i} className="text-[13px] py-1.5 border-b last:border-b-0" style={{ borderColor: "var(--g-border)" }}>
                <span className="g-label-xs mr-2">{m.role === "user" ? "visitor" : "employee"}</span>
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </GSectionCard>
  );
}

export function VersionsTab({ agent, versions, onPublish, onRollback, busy }: {
  agent: Agent; versions: Record<string, unknown>[]; onPublish: () => void; onRollback: (versionId: string) => void; busy: boolean;
}) {
  return (
    <GSectionCard
      title="Versions & Deploy"
      description="Publishing snapshots the configuration; roll back to any previous version."
      action={<button className="g-btn" onClick={onPublish} disabled={busy}>{busy ? "Working…" : "Publish new version"}</button>}
    >
      <div className="px-5 pb-5">
        {versions.length === 0 ? (
          <p className="text-[13px] py-4" style={{ color: "var(--g-muted-foreground)" }}>
            No versions yet — publish {agent.name} to create the first snapshot.
          </p>
        ) : (
          <GTable head={["Version", "Published", "Snapshot", ""]}>
            {versions.map((v: Record<string, any>, idx: number) => (
              <tr key={v.id}>
                <GTd mono>v{versions.length - idx}</GTd>
                <GTd mono className="text-[12px]"><span style={{ color: "var(--g-muted-foreground)" }}>{formatDate(v.publishedAt)}</span></GTd>
                <GTd>{v.configSnapshot?.name || "—"}</GTd>
                <GTd>
                  {idx > 0 && (
                    <button className="g-btn-2" onClick={() => onRollback(v.id)} disabled={busy}>Roll back</button>
                  )}
                </GTd>
              </tr>
            ))}
          </GTable>
        )}
      </div>
    </GSectionCard>
  );
}

export function AgentConversationsTab({ agentId, agentName, isVoice }: { agentId: string; agentName: string; isVoice?: boolean }) {
  const [convos, setConvos] = useState<Conversation[]>(() => getCached(`agent_convos_${agentId}`) || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [threadDetail, setThreadDetail] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(!getCached(`agent_convos_${agentId}`));
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchConvos = useCallback(async () => {
    try {
      const data = await api.get(`/conversations?agentId=${agentId}&tab=${filter}`);
      const list = (Array.isArray(data) ? data : []).filter((c) => c.agentId === agentId);
      setConvos(list);
      if (list.length > 0) {
        setSelectedId((prev) => (prev && list.some((c) => c.id === prev) ? prev : list[0].id));
      } else {
        setSelectedId(null);
      }
    } catch (e) {
      console.error("Failed to load agent conversations", e);
    } finally {
      setLoading(false);
    }
  }, [agentId, filter]);

  useEffect(() => {
    setConvos([]);
    setSelectedId(null);
    fetchConvos();
  }, [agentId, fetchConvos]);

  useEffect(() => {
    if (!selectedId) {
      setThreadDetail(null);
      return;
    }
    let alive = true;
    (async () => {
      setLoadingDetail(true);
      try {
        const d = await api.get(`/conversations/${selectedId}`);
        if (alive) setThreadDetail(d);
      } catch (e) {
        console.error("Failed to load thread", e);
      } finally {
        if (alive) setLoadingDetail(false);
      }
    })();
    return () => { alive = false; };
  }, [selectedId]);

  if (loading && convos.length === 0) return <GSpinner />;

  return (
    <GSectionCard
      title={isVoice ? `${agentName} Recordings` : `${agentName} Conversations & Voice Sessions`}
      description={isVoice ? "Audio recordings from voice sessions handled by this employee." : "All chat sessions, voice transcripts, and audio recordings handled by this employee."}
      action={
        <div className="flex items-center gap-1.5 p-1 rounded-full border bg-[var(--g-surface)] text-[12px]" style={{ borderColor: "var(--g-border)" }}>
          {["all", "captured", "hot"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full capitalize font-medium transition cursor-pointer ${
                filter === f ? "bg-[var(--g-surface-2)] text-[var(--g-foreground)]" : "text-[var(--g-muted-foreground)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      }
    >
      <div className="p-0">
        {convos.length === 0 ? (
          <div className="p-12 text-center text-[13.5px]" style={{ color: "var(--g-muted-foreground)" }}>
            {isVoice ? `No recordings found for ${agentName} yet.` : `No conversations recorded for ${agentName} yet. Embed the widget or run a simulation to generate records.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] divide-x divide-[#efefef] min-h-[500px]">
            <div className="flex flex-col divide-y divide-[#efefef] overflow-y-auto max-h-[600px]">
              {convos.map((c) => {
                const active = c.id === selectedId;
                const isVoice = c.channel === "voice" || c.channel === "phone" || !!c.recordingUrl;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-4 text-left transition hover:bg-[var(--g-surface)] cursor-pointer ${
                      active ? "bg-[var(--g-surface-2)]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[12px]">{isVoice ? <I.Mic width={12} height={12} /> : <I.MessageSquare width={12} height={12} />}</span>
                        <span className="font-semibold text-[13.5px] truncate text-[var(--g-foreground)]">
                          {c.visitorLabel || "Visitor"}
                        </span>
                      </div>
                      {c.score && (
                        <GPill status={c.score === "Hot" ? "escalated" : c.score.toLowerCase()} />
                      )}
                    </div>
                    <p className="text-[12.5px] truncate text-[var(--g-muted-foreground)] mb-2">
                      {c.snippet || "No messages yet"}
                    </p>
                    <div className="flex items-center justify-between text-[11px] g-mono text-[var(--g-muted-foreground)]">
                      <span>{formatDate(c.startedAt)}</span>
                      <span>{c.messageCount} msgs</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-6 flex flex-col justify-between bg-[var(--g-surface)]">
              {loadingDetail ? (
                <div className="py-24 text-center"><GSpinner /></div>
              ) : threadDetail ? (
                <div className="space-y-4">
                  {threadDetail.lead && (
                    <div className="p-4 border rounded-grok bg-[var(--g-background)] flex items-center justify-between gap-4" style={{ borderColor: "var(--g-border)" }}>
                      <div>
                        <div className="text-[14px] font-semibold text-[var(--g-foreground)]">{threadDetail.lead.name || "Anonymous Lead"}</div>
                        <div className="g-mono text-[12px] text-[var(--g-muted-foreground)] mt-0.5">{threadDetail.lead.email || threadDetail.lead.phone || "No direct contact"}</div>
                      </div>
                      <div className="text-right">
                        <GPill status={threadDetail.lead.score === "Hot" ? "escalated" : threadDetail.lead.score ? threadDetail.lead.score.toLowerCase() : "new"} />
                        {threadDetail.lead.intent && (
                          <div className="text-[11.5px] text-[var(--g-muted-foreground)] mt-1">Intent: {threadDetail.lead.intent}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {(threadDetail.recordingUrl || threadDetail.channel === "voice" || threadDetail.channel === "phone") && (
                    <div className="p-4 border rounded-grok bg-[var(--g-background)] flex flex-col gap-2" style={{ borderColor: "var(--g-border)" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-[var(--g-foreground)] flex items-center gap-1.5"><I.Mic width={14} height={14} className="text-[var(--g-muted-foreground)]" /> Voice Recording</span>
                          {threadDetail.callMeta?.durationSec && (
                            <span className="g-pill g-pill-solid text-[10.5px]">{threadDetail.callMeta.durationSec}s</span>
                          )}
                        </div>
                        {threadDetail.callMeta?.latencyMs && (
                          <span className="g-mono text-[11px] text-[var(--g-muted-foreground)]">{threadDetail.callMeta.latencyMs}ms voice latency</span>
                        )}
                      </div>
                      {threadDetail.recordingUrl ? (
                        <audio key={threadDetail.recordingUrl} controls className="w-full h-8 mt-1 rounded-full" src={threadDetail.recordingUrl} />
                      ) : (
                        <div className="text-[13px] text-[var(--g-muted-foreground)] mt-2 italic">Recording not available for this call.</div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-2">
                    {(threadDetail.messages || []).map((m: Message) => {
                      const isVisitor = m.role === "visitor" || m.role === "user";
                      return (
                        <div key={m.id} className={`flex flex-col ${isVisitor ? "items-start" : "items-end"}`}>
                          <div className="text-[11px] g-mono text-[var(--g-muted-foreground)] mb-1 px-1">
                            {isVisitor ? "Visitor" : agentName} · {formatDate(m.createdAt)}
                          </div>
                          <div
                            className={`p-3.5 rounded-grok text-[13px] leading-relaxed max-w-[85%] border ${
                              isVisitor
                                ? "bg-[var(--g-background)] text-[var(--g-foreground)] rounded-tl-none"
                                : "bg-[var(--g-foreground)] text-[var(--g-background)] border-transparent rounded-tr-none"
                            }`}
                            style={{ borderColor: isVisitor ? "var(--g-border)" : "transparent" }}
                          >
                            {m.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-[13px]" style={{ color: "var(--g-muted-foreground)" }}>
                  Select a conversation from the left to view transcript.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GSectionCard>
  );
}

export function AgentCallsTab({ agentId, agentName, isVoice }: { agentId: string; agentName: string; isVoice?: boolean }) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCalls = useCallback(async () => {
    try {
      const data = await api.get(`/telephony/calls?agentId=${agentId}`);
      const list = (Array.isArray(data) ? data : []).filter((c) => c.agentId === agentId);
      setCalls(list);
      if (list.length > 0) {
        setSelectedCallId((prev) => (prev && list.some((c) => c.id === prev) ? prev : list[0].id));
      } else {
        setSelectedCallId(null);
      }
    } catch (e) {
      console.error("Failed to load agent calls", e);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    setCalls([]);
    setSelectedCallId(null);
    fetchCalls();
  }, [agentId, fetchCalls]);

  const selectedCall = calls.find((c) => c.id === selectedCallId) || calls[0] || null;

  const totalCalls = calls.length;
  const avgDuration = totalCalls > 0 ? Math.round(calls.reduce((s, c) => s + (c.durationSec || 0), 0) / totalCalls) : 0;
  const avgLatency = totalCalls > 0 ? Math.round(calls.reduce((s, c) => s + (c.latencyMs || 0), 0) / totalCalls) : 0;

  if (loading && calls.length === 0) return <GSpinner />;

  return (
    <div className="space-y-6">
      <GStatRow className="grid-cols-1 sm:grid-cols-3">
        <GStat label="Total Calls Handled" value={totalCalls} sub="Inbound & Outbound" />
        <GStat label="Avg Call Duration" value={`${avgDuration}s`} sub="Turn handling time" />
        <GStat label="Voice Latency" value={avgLatency ? `${avgLatency}ms` : "—"} sub="Gemini Flash 2.0 pipeline" />
      </GStatRow>

      <GSectionCard
        title={isVoice ? `${agentName} Transcripts` : `${agentName} Call Records & Transcripts`}
        description={isVoice ? "Live speech transcripts and phone call outcomes." : "Audio recordings, live speech transcripts, and phone call outcomes."}
      >
        <div className="p-0">
          {calls.length === 0 ? (
            <div className="p-12 text-center text-[13.5px]" style={{ color: "var(--g-muted-foreground)" }}>
              {isVoice ? `No transcripts found for ${agentName} yet.` : `No telephony calls logged for ${agentName} yet. Connect a phone line in the Channels tab.`}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] divide-x divide-[#efefef] min-h-[500px]">
              <div className="flex flex-col divide-y divide-[#efefef] overflow-y-auto max-h-[600px]">
                {calls.map((c) => {
                  const active = c.id === selectedCall?.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCallId(c.id)}
                      className={`p-4 text-left transition hover:bg-[var(--g-surface)] cursor-pointer ${
                        active ? "bg-[var(--g-surface-2)]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-[13.5px] g-mono text-[var(--g-foreground)]">
                          {c.fromNumber || "Anonymous Caller"}
                        </span>
                        <span className="g-pill g-pill-solid text-[10.5px]">{c.durationSec || 0}s</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] g-mono text-[var(--g-muted-foreground)] mt-2">
                        <span>{formatDate(c.createdAt)}</span>
                        <span>{c.latencyMs ? `${c.latencyMs}ms` : "Live"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 flex flex-col justify-between bg-[var(--g-surface)]">
                {selectedCall ? (
                  <div className="space-y-6">
                    <div className="p-4 border rounded-grok bg-[var(--g-background)] flex flex-wrap items-center justify-between gap-4" style={{ borderColor: "var(--g-border)" }}>
                      <div>
                        <div className="g-label-xs">Caller Phone</div>
                        <div className="text-[16px] font-semibold g-mono mt-1 text-[var(--g-foreground)]">{selectedCall.fromNumber}</div>
                      </div>
                      <div>
                        <div className="g-label-xs">Duration</div>
                        <div className="text-[14px] font-medium g-num mt-1">{selectedCall.durationSec || 0} seconds</div>
                      </div>
                      {selectedCall.recordingUrl && (
                        <div className="w-full pt-1">
                          <audio key={selectedCall.recordingUrl || "empty"} controls className="w-full h-8 mt-1 rounded-full" src={selectedCall.recordingUrl} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2">
                      {selectedCall.conversation?.messages && selectedCall.conversation.messages.length > 0 ? (
                        selectedCall.conversation.messages.map((m: Message) => {
                          const isVisitor = m.role === "visitor" || m.role === "user";
                          return (
                            <div key={m.id} className={`flex flex-col ${isVisitor ? "items-start" : "items-end"}`}>
                              <div className="text-[11px] g-mono text-[var(--g-muted-foreground)] mb-1 px-1">
                                {isVisitor ? "Caller" : agentName} · {formatDate(m.createdAt)}
                              </div>
                              <div
                                className={`p-3.5 rounded-grok text-[13px] leading-relaxed max-w-[85%] border ${
                                  isVisitor
                                    ? "bg-[var(--g-background)] text-[var(--g-foreground)] rounded-tl-none"
                                    : "bg-[var(--g-foreground)] text-[var(--g-background)] border-transparent rounded-tr-none"
                                }`}
                                style={{ borderColor: isVisitor ? "var(--g-border)" : "transparent" }}
                              >
                                {m.content}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-12 text-center text-[13px]" style={{ color: "var(--g-muted-foreground)" }}>
                          No text transcript available for this call session.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center text-[13px]" style={{ color: "var(--g-muted-foreground)" }}>
                    Select a call record to inspect details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </GSectionCard>
    </div>
  );
}

export function AgentLeadsTab({ agentId, agentName }: { agentId: string; agentName: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const data = await api.get(`/leads?agentId=${agentId}`);
      const list = (Array.isArray(data) ? data : []).filter(
        (l) => l.agentId === agentId || l.conversation?.agentId === agentId
      );
      setLeads(list);
    } catch (e) {
      console.error("Failed to load agent leads", e);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    setLeads([]);
    fetchLeads();
  }, [agentId, fetchLeads]);

  if (loading && leads.length === 0) return <GSpinner />;

  return (
    <GSectionCard
      title={`${agentName} Captured Leads`}
      description="Prospects and customer opportunities generated by this AI employee."
      action={<Link to="/app/leads" className="g-btn-2 text-[12px]">All workspace leads →</Link>}
    >
      <div className="p-0">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-[13.5px]" style={{ color: "var(--g-muted-foreground)" }}>
            No leads captured by {agentName} yet.
          </div>
        ) : (
          <GTable head={["Lead Name", "Contact", "Score", "Status", "Intent / Notes", "Captured"]}>
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-[var(--g-surface)] transition">
                <GTd>
                  <Link to="/app/agents" className="font-semibold text-[13.5px] hover:underline text-[var(--g-foreground)]">
                    {l.name || "Anonymous Prospect"}
                  </Link>
                </GTd>
                <GTd mono className="text-[12px]">
                  <div>{l.email || "—"}</div>
                  {l.phone && <div className="text-[11px]" style={{ color: "var(--g-muted-foreground)" }}>{l.phone}</div>}
                </GTd>
                <GTd>
                  <GPill status={l.score === "Hot" ? "escalated" : l.score ? l.score.toLowerCase() : "new"} />
                </GTd>
                <GTd mono className="capitalize">{l.status || "New"}</GTd>
                <GTd className="max-w-xs truncate text-[12.5px]">
                  <span style={{ color: "var(--g-muted-foreground)" }}>{l.intent || l.aiNote || "—"}</span>
                </GTd>
                <GTd mono className="text-[12px]"><span style={{ color: "var(--g-muted-foreground)" }}>{formatDate(l.createdAt)}</span></GTd>
              </tr>
            ))}
          </GTable>
        )}
      </div>
    </GSectionCard>
  );
}

export function AgentIntegrationsTab({ agentName }: { agentId: string; agentName: string }) {
  const INTEGRATIONS = [
    { id: "salesforce", name: "Salesforce", desc: "Sync leads and lookup accounts in real-time.", connected: false, icon: <I.Box width={16} height={16} /> },
    { id: "hubspot", name: "HubSpot", desc: "Create contacts and log activities.", connected: false, icon: <I.Layout width={16} height={16} /> },
    { id: "twilio", name: "Twilio", desc: "Use custom Twilio numbers for voice.", connected: false, icon: <I.Phone width={16} height={16} /> },
    { id: "slack", name: "Slack", desc: "Get notified when hot leads are captured.", connected: false, icon: <I.MessageSquare width={16} height={16} /> }
  ];

  return (
    <GSectionCard
      title={`${agentName} Integrations`}
      description="Connect this employee to your existing tools and workflows."
    >
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((integ) => (
          <div key={integ.id} className="p-4 border rounded-grok flex flex-col justify-between bg-[var(--g-surface)] hover:border-[var(--g-border-strong)] transition-colors" style={{ borderColor: "var(--g-border)" }}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">{integ.icon}</span>
                  <span className="font-semibold text-[14px] text-[var(--g-foreground)]">{integ.name}</span>
                </div>
                {integ.connected && (
                  <span className="g-pill g-pill-solid bg-emerald-900 border-emerald-800 text-emerald-100 text-[10px]">Connected</span>
                )}
              </div>
              <p className="text-[12.5px]" style={{ color: "var(--g-muted-foreground)" }}>{integ.desc}</p>
            </div>
            <button className={integ.connected ? "g-btn-2 text-[12px] self-start" : "g-btn text-[12px] self-start"}>
              {integ.connected ? "Configure" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </GSectionCard>
  );
}
