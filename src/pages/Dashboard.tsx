import { CubeIcon } from "@/components/CubeIcon";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PageHead, MetricCard, ScoreBadge, StateBlock, Loading } from "../components/grok";
import * as I from "../components/icons";
import { api } from "../lib/api";
import { getCached, setCached } from "../lib/cache";
import { useAuth } from "../lib/auth";

interface Metric {
  value: string;
  deltaPct: string;
  deltaTone?: "up" | "flat";
  spark: string;
}

interface NeedsYouLead {
  id: string;
  score: "Hot" | "Warm" | "Cold";
  name: string;
  email: string;
  note: string;
  time: string;
}

interface RecentActivityItem {
  id: string;
  visitor: string;
  time: string;
  messages: number;
  captured: boolean;
}

interface DashboardMetrics {
  conversations: Metric;
  leadsCaptured: Metric;
  hotLeads: Metric;
  opportunities: Metric;
  needsYou: NeedsYouLead[];
  recentActivity: RecentActivityItem[];
}



const FALLBACK_METRICS: Record<"7d" | "30d", DashboardMetrics> = {
  "7d": {
    conversations: {
      value: "1,254",
      deltaPct: "+12.5%",
      deltaTone: "up",
      spark: "45,52,48,61,59,70,82",
    },
    leadsCaptured: {
      value: "342",
      deltaPct: "+5.2%",
      deltaTone: "up",
      spark: "12,15,10,18,21,25,30",
    },
    hotLeads: {
      value: "89",
      deltaPct: "-2.1%",
      deltaTone: "flat",
      spark: "5,4,6,3,5,8,7",
    },
    opportunities: {
      value: "$12,450",
      deltaPct: "+18.4%",
      deltaTone: "up",
      spark: "400,500,450,600,800,750,900",
    },
    needsYou: [
      {
        id: "lead-1",
        score: "Hot",
        name: "John Doe",
        email: "john@example.com",
        note: "Requested enterprise pricing",
        time: "10 mins ago",
      },
      {
        id: "lead-2",
        score: "Warm",
        name: "Sarah Smith",
        email: "sarah@acme.com",
        note: "Questions about integration",
        time: "2 hours ago",
      },
    ],
    recentActivity: [
      {
        id: "act-1",
        visitor: "visitor-8f2a",
        time: "Just now",
        messages: 14,
        captured: true,
      },
      {
        id: "act-2",
        visitor: "visitor-9c1b",
        time: "5 mins ago",
        messages: 3,
        captured: false,
      },
      {
        id: "act-3",
        visitor: "visitor-4d7e",
        time: "12 mins ago",
        messages: 28,
        captured: true,
      },
    ],
  },
  "30d": {
    conversations: {
      value: "1,254",
      deltaPct: "+12.5%",
      deltaTone: "up",
      spark: "45,52,48,61,59,70,82",
    },
    leadsCaptured: {
      value: "342",
      deltaPct: "+5.2%",
      deltaTone: "up",
      spark: "12,15,10,18,21,25,30",
    },
    hotLeads: {
      value: "89",
      deltaPct: "-2.1%",
      deltaTone: "flat",
      spark: "5,4,6,3,5,8,7",
    },
    opportunities: {
      value: "$12,450",
      deltaPct: "+18.4%",
      deltaTone: "up",
      spark: "400,500,450,600,800,750,900",
    },
    needsYou: [
      {
        id: "lead-1",
        score: "Hot",
        name: "John Doe",
        email: "john@example.com",
        note: "Requested enterprise pricing",
        time: "10 mins ago",
      },
      {
        id: "lead-2",
        score: "Warm",
        name: "Sarah Smith",
        email: "sarah@acme.com",
        note: "Questions about integration",
        time: "2 hours ago",
      },
    ],
    recentActivity: [
      {
        id: "act-1",
        visitor: "visitor-8f2a",
        time: "Just now",
        messages: 14,
        captured: true,
      },
      {
        id: "act-2",
        visitor: "visitor-9c1b",
        time: "5 mins ago",
        messages: 3,
        captured: false,
      },
      {
        id: "act-3",
        visitor: "visitor-4d7e",
        time: "12 mins ago",
        messages: 28,
        captured: true,
      },
    ],
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(
    () => getCached<DashboardMetrics>(`dashboard_metrics_7d`) || FALLBACK_METRICS["7d"]
  );
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    const cached = getCached<DashboardMetrics>(`dashboard_metrics_${range}`);
    if (cached) {
      setMetrics(cached);
      setIsRefreshing(true);
    }

    try {
      const data = await api.get(`/dashboard/metrics?range=${range}`);
      if (data && data.conversations) {
        setCached(`dashboard_metrics_${range}`, data);
        setMetrics(data);
      } else {
        setMetrics(FALLBACK_METRICS[range]);
      }
    } catch {
      setMetrics(FALLBACK_METRICS[range]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const userName = user?.name || "Demo User";

  const toggleRange = () => {
    const nextRange = range === "7d" ? "30d" : "7d";
    const cachedNext = getCached<DashboardMetrics>(`dashboard_metrics_${nextRange}`);
    setMetrics(cachedNext || FALLBACK_METRICS[nextRange]);
    setRange(nextRange);
  };

  if (loading && !metrics) {
    return (
      <div className="space-y-6">
        <PageHead
          title="Dashboard"
          subtitle={`Good morning, ${userName} — here's how your AI employee is doing.`}
          right={
            <div className="flex items-center gap-2 bg-surface border border-line rounded-full px-3.5 py-1.5 text-[13px] font-semibold cursor-wait">
              Loading...
            </div>
          }
        />
        <div className="g-card py-20 flex items-center justify-center fadeup">
          <Loading label="Aggregating metrics" subtitle="Syncing workspace telemetry" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHead
          title="Dashboard"
          subtitle="An error occurred while loading dashboard metrics."
        />
        <div className="g-card p-6 border border-red-200 text-red-700 bg-red-50 flex flex-col items-center">
          <p className="font-semibold">{error}</p>
          <button className="g-btn mt-4" onClick={fetchMetrics}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isEmpty =
    metrics &&
    metrics.conversations.value === "0" &&
    metrics.leadsCaptured.value === "0" &&
    metrics.recentActivity.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <PageHead
          title="Dashboard"
          subtitle={`Good morning, ${userName} — here's how your AI employee is doing.`}
          right={
            <div
              className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 text-[13px] font-medium text-[#09090B] cursor-pointer select-none hover:bg-[#F4F5F6] shadow-2xs transition-colors"
              onClick={toggleRange}
            >
              <span>{range === "7d" ? "Last 7 days" : "Last 30 days"}</span>
              <I.Chevron width={12} height={12} />
            </div>
          }
        />
        <StateBlock
          title="Install your chat widget"
          body="No conversations have been recorded yet. Embed the chat widget on your website to start capturing leads and qualified opportunities."
          action="Go to Widget Integration"
          onAction={() => navigate({ to: "/app/widget" })}
        />
      </div>
    );
  }

  return (
    <>
      <PageHead
        title="Dashboard"
        subtitle={`Good morning, ${userName} — here's how your AI employee is doing.`}
        right={
          <button
            type="button"
            className="g-btn-2 text-[13px] h-[36px] px-4 font-semibold inline-flex items-center gap-2 cursor-pointer select-none shadow-xs"
            onClick={toggleRange}
          >
            <span>{range === "7d" ? "Last 7 days" : "Last 30 days"}</span>
            {isRefreshing ? (
              <span className="w-3.5 h-3.5 border-2 border-[var(--g-foreground)] border-t-transparent rounded-full animate-spin ml-0.5 inline-block" />
            ) : (
              <I.Chevron width={12} height={12} />
            )}
          </button>
        }
      />

      {metrics && (
        <>
          <section className="grid grid-cols-4 gap-4 mb-5.5" style={{ marginBottom: 22 }}>
            <div className="fadeup" style={{ animationDelay: ".04s" }}>
              <MetricCard
                to="/app/conversations"
                label="Conversations"
                value={metrics.conversations.value}
                delta={metrics.conversations.deltaPct}
                deltaTone={metrics.conversations.deltaTone}
                spark={metrics.conversations.spark}
              />
            </div>
            <div className="fadeup" style={{ animationDelay: ".10s" }}>
              <MetricCard
                to="/app/leads"
                label="Leads captured"
                value={metrics.leadsCaptured.value}
                delta={metrics.leadsCaptured.deltaPct}
                deltaTone={metrics.leadsCaptured.deltaTone}
                spark={metrics.leadsCaptured.spark}
              />
            </div>
            <div className="fadeup" style={{ animationDelay: ".16s" }}>
              <MetricCard
                to="/app/leads"
                label="Hot leads"
                value={metrics.hotLeads.value}
                delta={metrics.hotLeads.deltaPct}
                deltaTone={metrics.hotLeads.deltaTone}
                spark={metrics.hotLeads.spark}
              />
            </div>
            <div className="fadeup" style={{ animationDelay: ".22s" }}>
              <MetricCard
                to="/app/leads"
                label="Opportunities"
                value={metrics.opportunities.value}
                delta={metrics.opportunities.deltaPct}
                deltaTone={metrics.opportunities.deltaTone}
                spark={metrics.opportunities.spark}
              />
            </div>
          </section>

          <div className="grid grid-cols-[1.35fr_1fr] gap-4">
            <div className="g-card fadeup">
              <div className="flex items-center gap-2.5 px-5 pt-[17px] pb-3.5">
                <I.Zap width={16} height={16} className="text-[var(--g-foreground)]" />
                <h2 className="font-display text-[16.5px] font-bold">Needs you</h2>
                <span className="g-pill g-pill-solid text-xs font-semibold !py-0.5 !px-2.5">
                  {metrics.needsYou.length} hot
                </span>
                <Link to="/app/leads" className="ml-auto text-[13px] font-semibold text-[var(--g-foreground)] hover:underline flex items-center gap-1">
                  View all leads <CubeIcon className="w-3 h-3" />
                </Link>
              </div>
              {metrics.needsYou.length === 0 ? (
                <div className="p-8 text-center text-ink-muted text-sm border-t border-line">
                  No active hot leads needing response at this time.
                </div>
              ) : (
                metrics.needsYou.map((l) => (
                  <Link
                    key={l.id}
                    to="/app/agents"
                    className="flex items-center gap-3.5 px-5 py-3 border-t border-line hover:bg-[var(--g-surface)] transition group"
                  >
                    <ScoreBadge score={l.score} />
                    <div className="flex flex-col w-[170px] shrink-0 min-w-0">
                      <b className="font-semibold text-sm truncate text-[var(--g-foreground)]">{l.name}</b>
                      <small className="text-ink-muted text-[12.5px] truncate">{l.email}</small>
                    </div>
                    <div className="flex-1 min-w-0 text-ink-muted text-[13.5px] truncate pr-2">
                      AI note: <em className="not-italic text-[var(--g-foreground)] g-pill g-pill-muted !py-0.5 !px-1.5">“{l.note}”</em>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-auto pl-2">
                      <span className="text-ink-muted text-[12.5px] whitespace-nowrap">{l.time}</span>
                      <span className="g-btn-2 !py-1.5 !px-4 text-[13px]">Open</span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="g-card fadeup">
              <div className="flex items-center gap-2.5 px-5 pt-[17px] pb-3.5">
                <h2 className="font-display text-[16.5px] font-bold">Recent activity</h2>
                <Link to="/app/conversations" className="ml-auto text-[13px] font-semibold text-[var(--g-foreground)] hover:underline flex items-center gap-1">
                  Conversations <CubeIcon className="w-3 h-3" />
                </Link>
              </div>
              {metrics.recentActivity.length === 0 ? (
                <div className="p-8 text-center text-ink-muted text-sm border-t border-line">
                  No conversation activity yet.
                </div>
              ) : (
                metrics.recentActivity.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-t border-line">
                    <span className="w-[30px] h-[30px] rounded-[9px] grid place-items-center shrink-0 bg-[var(--g-surface-2)] text-[var(--g-foreground)] border border-[var(--g-border)]">
                      <I.Chat width={16} height={16} />
                    </span>
                    <span className="flex-1 text-[13.5px]">
                      {c.visitor} finished a chat
                      <small className="block text-ink-muted text-xs mt-0.5">
                        {c.time} · {c.messages} messages
                      </small>
                    </span>
                    {c.captured && (
                      <span className="g-pill g-pill-strong !py-1 !px-2.5 whitespace-nowrap">
                        Captured lead
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
