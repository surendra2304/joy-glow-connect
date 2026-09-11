import { useMemo, useState, useEffect } from "react";
import * as I from "../components/icons";
import connectorsData from "../data/connectors.json";
import { api } from "../lib/api";
import { Search, X } from "lucide-react";
import { renderConnectorIcon } from "../components/renderConnectorIcon";
import { CubeIcon } from "../components/CubeIcon";

type ConnectorStatus = "not-connected" | "connected" | "needs-reauth";
type ConnectorCategory = "All" | "Communication" | "CRM" | "Productivity" | "Calendar" | "Support" | "Project Management";

type ConnectorRecord = {
  id: string;
  name: string;
  description: string;
  status: ConnectorStatus;
  iconName: string;
  category: Exclude<ConnectorCategory, "All">;
  logoUrl: string;
};

const categoryTabs: string[] = ["All", "CRM", "Communication", "Support", "Productivity", "Calendar", "Telephony", "Project Management"];

const defaultConnectors: ConnectorRecord[] = connectorsData as unknown as ConnectorRecord[];

export default function Connectors() {
  const [connectors, setConnectors] = useState<ConnectorRecord[]>(defaultConnectors);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const res = await api.get('/integrations');
      const connectedProviders = (res.integrations || []).map((i: any) => i.provider);
      
      setConnectors(prev => prev.map(c => {
        if (connectedProviders.includes(c.id)) {
          return { ...c, status: "connected" };
        }
        return c;
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredConnectors = useMemo(() => {
    return connectors.filter((connector) => {
      const matchesCategory = activeCategory === "All" || 
        connector.category.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === "Billing" && connector.id === "stripe") ||
        (activeCategory === "Support" && connector.id.includes("support")) ||
        (activeCategory === "Project Management" && (connector.id === "jira" || connector.id === "notion"));
      
      const matchesQuery =
        connector.name.toLowerCase().includes(query.toLowerCase()) ||
        connector.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, connectors, query]);

  const handleConnectorConnect = async (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (!connector) return;

    if (connector.status === "connected") {
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = window.location.origin + "/app/connectors";
      const res = await api.post('/integrations/connect', {
        provider: connectorId,
        redirectUrl
      });
      if (res && res.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-none mx-auto pb-20 animate-fadein min-h-[calc(100vh-2.5rem)]">
      {/* ─── Page Title (Exact kaliganai.com Standard) ──────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-[#09090B] tracking-tight">
          Integration Directory
        </h1>
        <p className="text-[11.5px] text-[#64748B] mt-1 font-normal max-w-2xl">
          Search, filter, and connect the systems your AI employees need to do real work.
        </p>
      </div>

      {/* ─── Seamless Container (Exact kaliganai.com/features/integrations) ─ */}
      <div className="rounded-[28px] border border-border bg-card p-6 space-y-5 shadow-[0_18px_45px_-38px_rgba(15,23,42,.5)]">
        {/* Full-Width Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search integrations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-5 pr-11 py-3.5 text-[14px] rounded-full border border-[#E5E7EB] bg-white text-[#09090B] placeholder-[#94A3B8] focus:outline-none focus:border-[#09090B] transition-all shadow-2xs"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {query ? (
              <button
                onClick={() => setQuery("")}
                className="text-[#94A3B8] hover:text-[#09090B] cursor-pointer p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-[#94A3B8] pointer-events-none" />
            )}
          </div>
        </div>

        {/* Category Pill Tabs Strip */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categoryTabs.map((tab) => {
            const active = activeCategory === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-[#09090B] text-white shadow-xs font-semibold"
                    : "bg-white border border-[#E5E7EB] text-[#64748B] hover:text-[#09090B] hover:bg-[#F4F5F6]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Integration cards */}
        {filteredConnectors.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] p-12 text-center my-4 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] grid place-items-center mx-auto text-[#64748B]">
              <I.Search width={20} height={20} />
            </div>
            <h3 className="text-base font-bold text-[#09090B]">No connectors found</h3>
            <p className="text-[#64748B] text-[13px] max-w-sm mx-auto">
              Try searching for a different keyword or selecting another category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {filteredConnectors.map((connector) => {
              const isConnected = connector.status === "connected";

              return (
                <div
                  key={connector.id}
                  className="group rounded-2xl bg-card border border-border p-5 hover:border-muted-foreground/30 hover:shadow-sm transition-all flex flex-col justify-between min-h-[196px]"
                >
                  <div>
                    {/* Brand Logo & Connection Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden grid place-items-center">
                        {renderConnectorIcon(connector.id, undefined, 10)}
                      </div>

                      {isConnected && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Connected
                        </span>
                      )}
                    </div>

                    {/* Name & Category Label */}
                    <div className="mt-5">
                      <h3 className="font-bold text-[16px] text-[#09090B] tracking-tight leading-tight">
                        {connector.name}
                      </h3>
                      <span className="text-[11.5px] font-medium text-[#94A3B8] block mt-0.5">
                        {connector.category}
                      </span>
                    </div>

                    {/* Mandate Description */}
                    <p className="text-[12.5px] text-[#64748B] leading-relaxed mt-3 line-clamp-3">
                      {connector.description}
                    </p>
                  </div>

                  {/* Minimal Text Action Link */}
                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => handleConnectorConnect(connector.id)}
                      disabled={loading}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#09090B] hover:text-black group-hover:gap-1.5 transition-all cursor-pointer select-none"
                    >
                      <span>{isConnected ? "Manage" : "Connect"}</span>
                      <CubeIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
