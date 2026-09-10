import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { PageHead, ScoreBadge, Loading } from "../components/grok";
import * as I from "../components/icons";
import { api } from "../lib/api";

interface ConvoItem {
  id: string;
  visitorLabel: string;
  snippet: string;
  score: "Hot" | "Warm" | "Cold";
  captured: boolean;
  messageCount: number;
  startedAt: string;
}

interface MessageItem {
  id: string;
  role: "visitor" | "agent";
  content: string;
  createdAt: string;
}

interface LeadInfo {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  score: string;
  status: string;
  intent?: string;
  aiNote?: string;
}

interface ConvoDetail {
  id: string;
  channel: string;
  visitorLabel?: string;
  visitorMeta?: any;
  captured: boolean;
  score?: "Hot" | "Warm" | "Cold";
  messageCount: number;
  startedAt: string;
  messages: MessageItem[];
  lead: LeadInfo | null;
}

// Module-level caches for instant 0ms switching
const tabListCache: Record<string, ConvoItem[]> = {};
const detailCache: Record<string, ConvoDetail> = {};

export default function Conversations() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();

  const tabs = ["All", "Captured", "Hot", "Unread"];
  const [activeTab, setActiveTab] = useState("All");
  const [list, setList] = useState<ConvoItem[]>(() => tabListCache["all"] || []);
  const [detail, setDetail] = useState<ConvoDetail | null>(() => (id ? detailCache[id] || null : null));
  
  const [listLoading, setListLoading] = useState(() => !tabListCache["all"]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  });

  // Load conversations list based on active tab only
  const fetchList = useCallback(async () => {
    const tabQuery = activeTab.toLowerCase();
    if (tabListCache[tabQuery]) {
      setList(tabListCache[tabQuery]);
      setListLoading(false);
    } else {
      setListLoading(true);
    }
    setError(null);

    try {
      const data = await api.get(`/conversations?tab=${tabQuery}`);
      tabListCache[tabQuery] = data;
      setList(data || []);
      
      // If we have no active id in URL and no selection, select first thread
      if (data && data.length > 0 && !window.location.pathname.split("/app/conversations/")[1]) {
        navigate({ to: `/app/conversations/${data[0].id}` as any, replace: true });
      }
    } catch (err: any) {
      if (!tabListCache[tabQuery]) {
        setError(err.message || "Failed to load conversations");
      }
    } finally {
      setListLoading(false);
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Load active conversation detail on demand with instant cache-hit
  useEffect(() => {
    if (!id) {
      setDetail(null);
      return;
    }

    if (detailCache[id]) {
      setDetail(detailCache[id]);
      setDetailLoading(false);
    } else {
      setDetailLoading(true);
    }

    let isSubscribed = true;
    const fetchDetail = async () => {
      try {
        const data = await api.get(`/conversations/${id}`);
        if (isSubscribed) {
          detailCache[id] = data;
          setDetail(data);
        }
      } catch (err: any) {
        console.error("Failed to load thread details", err);
      } finally {
        if (isSubscribed) {
          setDetailLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      isSubscribed = false;
    };
  }, [id]);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = new Date().getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  };

  const getScoreColor = (score?: string) => {
    if (score === "Hot") return "#D9534F";
    if (score === "Warm") return "#E0A100";
    return "#C7D2C9";
  };

  return (
    <>
      <PageHead title="Conversations" subtitle="Every chat your AI has had with a visitor." />
      
      {error && (
        <div className="g-card p-4 text-red-700 border border-red-200 bg-red-50 mb-4 flex justify-between items-center text-xs">
          <span>{error}</span>
          <button className="g-btn-sm" onClick={fetchList}>Retry</button>
        </div>
      )}

      <div className="grid grid-cols-[340px_1fr] gap-4 fadeup">
        {/* Left Side: Threads List */}
        <div className="g-card overflow-hidden flex flex-col h-[620px]">
          <div className="flex gap-1.5 p-3 border-b border-[var(--g-border-light)] shrink-0 bg-[var(--g-surface)]">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-[12px] font-medium px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === t
                    ? "bg-[var(--g-foreground)] text-[var(--g-background)] font-semibold shadow-xs"
                    : "text-[var(--g-muted-foreground)] hover:text-[var(--g-foreground)] hover:bg-[var(--g-surface-2)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div ref={parentRef} className="flex-1 overflow-y-auto">
            {listLoading ? (
              <div className="py-16 flex items-center justify-center">
                <Loading label="Loading threads" size="sm" />
              </div>
            ) : list.length === 0 ? (
              <div className="p-8 text-center text-ink-muted text-sm">
                No threads found in this category.
              </div>
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const c = list[virtualRow.index];
                  if (!c) return null;
                  return (
                    <div
                      key={c.id}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <button
                        onClick={() => navigate({ to: `/app/conversations/${c.id}` })}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3.5 border-b border-line transition ${
                          id === c.id ? "bg-[var(--g-surface-2)] font-semibold" : "hover:bg-[var(--g-surface-2)]"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: getScoreColor(c.score) }}
                        />
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-2">
                            <b className="font-semibold text-[13.5px]">{c.visitorLabel}</b>
                            {c.captured && (
                              <span className="g-pill g-pill-strong !py-0.5 !px-1.5">
                                captured
                              </span>
                            )}
                          </span>
                          <span className="block text-ink-muted text-[12.5px] truncate mt-0.5">{c.snippet}</span>
                        </span>
                        <span className="text-ink-muted text-[11.5px] whitespace-nowrap">{formatTime(c.startedAt)}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Conversation Window */}
        {detailLoading && !detail ? (
          <div className="g-card p-12 flex items-center justify-center h-[620px]">
            <Loading label="Loading thread transcript" />
          </div>
        ) : !detail ? (
          <div className="g-card p-12 flex flex-col items-center justify-center text-center h-[620px]">
            <div className="w-14 h-14 rounded-2xl bg-[var(--g-surface-2)] text-[var(--g-foreground)] border border-[var(--g-border)] grid place-items-center mb-4">
              <I.Chat width={26} height={26} />
            </div>
            <h3 className="text-lg font-bold">No conversation selected</h3>
            <p className="text-ink-muted text-[14.5px] mt-1.5 max-w-xs">
              Select a chat thread from the left rail to view its message details and visitor intelligence.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_240px] gap-4 h-[620px]">
            {/* Thread Chat Transcript */}
            <div className="g-card p-5 flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 pb-3 border-b border-line mb-4 shrink-0">
                <b className="font-semibold">{detail.visitorLabel || "Visitor"}</b>
                {detail.score && <ScoreBadge score={detail.score} />}
                <span className="ml-auto text-ink-muted text-[12.5px]">
                  {detail.messages.length} messages · {formatTime(detail.startedAt)}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {detail.messages.map((m) => {
                  const isVisitor = m.role === "visitor";
                  return (
                    <div key={m.id} className={`max-w-[80%] flex flex-col ${isVisitor ? "items-start" : "items-end ml-auto"}`}>
                      <div className="text-ink-muted text-[11px] mb-1 tracking-wide">
                        {isVisitor ? "VISITOR" : "AI"}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-xl text-[13.5px] leading-relaxed inline-block border ${
                          isVisitor
                            ? "bg-surface-2 border-line rounded-tl-[3px] text-ink"
                            : "bg-[var(--g-surface-2)] border-[var(--g-border)] rounded-tr-[3px] text-[var(--g-foreground)]"
                        }`}
                      >
                        {m.content}
                      </div>
                      <span className="text-[10px] text-ink-muted mt-1 px-1">
                        {formatTime(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Information Rail */}
            <div className="flex flex-col gap-4 overflow-y-auto h-full">
              {/* Visitor metadata */}
              <div className="g-card p-4 shrink-0">
                <div className="text-[11px] font-bold uppercase tracking-wide text-ink-muted mb-3">
                  Visitor info
                </div>
                <dl className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Location</dt>
                    <dd>{detail.visitorMeta?.city || detail.visitorMeta?.ip || "Unknown"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Platform</dt>
                    <dd>{detail.visitorMeta?.device || detail.visitorMeta?.os || "Web Client"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Channel</dt>
                    <dd className="capitalize">{detail.channel}</dd>
                  </div>
                </dl>
              </div>

              {/* AI insights & Lead Details */}
              <div className="g-card p-4 shrink-0">
                <div className="text-[11px] font-bold uppercase tracking-wide text-ink-muted mb-3 flex items-center gap-1.5">
                  <I.Sparkle width={12} height={12} className="text-[var(--g-foreground)]" /> AI insights
                </div>
                
                <dl className="space-y-3 text-[13px]">
                  <div>
                    <dt className="text-ink-muted">Lead Intent</dt>
                    <dd className="g-pill g-pill-strong mt-1">
                      {detail.lead?.intent || "Casual browsing"}
                    </dd>
                  </div>
                  {detail.lead?.aiNote && (
                    <div>
                      <dt className="text-ink-muted">Reasoning</dt>
                      <dd className="italic text-ink-muted leading-tight mt-0.5">
                        “{detail.lead.aiNote}”
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-ink-muted">Captured Profile</dt>
                    <dd className="mt-1 space-y-1">
                      {detail.lead ? (
                        <>
                          {detail.lead.name && (
                            <div className="flex items-center gap-1.5">
                              <span className="g-pill g-pill-muted !px-1.5 !py-0 text-[11px]">Name</span>
                              <span className="truncate">{detail.lead.name}</span>
                            </div>
                          )}
                          {detail.lead.email && (
                            <div className="flex items-center gap-1.5">
                              <span className="g-pill g-pill-muted !px-1.5 !py-0 text-[11px]">Email</span>
                              <span className="truncate" title={detail.lead.email}>{detail.lead.email}</span>
                            </div>
                          )}
                          {detail.lead.phone && (
                            <div className="flex items-center gap-1.5">
                              <span className="g-pill g-pill-muted !px-1.5 !py-0 text-[11px]">Phone</span>
                              <span>{detail.lead.phone}</span>
                            </div>
                          )}
                          {!detail.lead.name && !detail.lead.email && !detail.lead.phone && (
                            <span className="text-ink-muted italic">None yet</span>
                          )}
                        </>
                      ) : (
                        <span className="text-ink-muted italic">None yet</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
