import { useEffect, useState, useMemo } from "react";
import { Loading, GModal } from "../components/grok";
import { api } from "../lib/api";
import {
  FileText,
  Search,
  X,
  RotateCcw,
  BookOpen,
  FolderTree,
  Brain,
  Zap,
  Trash2,
  Plus,
  RefreshCw,
  HelpCircle,
  PackageOpen,
  ArrowLeftRight,
} from "lucide-react";

interface DocSource {
  id: string;
  type: string;
  name: string;
  status: string;
  chunkCount: number;
  pct: number;
  updatedAt: string;
  error?: string | null;
}

interface KbMetrics {
  sources: number;
  ready: number;
  topicsApprox: number;
  lastTrainedAt: string;
}

let kbDocsCache: DocSource[] | null = (() => {
  try {
    const s = sessionStorage.getItem("kaligan_kb_docs");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
})();

let kbMetricsCache: KbMetrics | null = (() => {
  try {
    const s = sessionStorage.getItem("kaligan_kb_metrics");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
})();

export default function Knowledge() {
  const [sources, setSources] = useState<DocSource[]>(() => kbDocsCache || []);
  const [metrics, setMetrics] = useState<KbMetrics | null>(() => kbMetricsCache || null);
  const [loading, setLoading] = useState(() => !kbDocsCache);
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceType, setSourceType] = useState<"file" | "url" | "faq">("file");

  // Filters & Search
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");

  // Form states
  const [urlInput, setUrlInput] = useState("");
  const [urlName, setUrlName] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [faqName, setFaqName] = useState("");
  const [faqItems, setFaqItems] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      const docs = await api.get("/kb/documents");
      kbDocsCache = docs || [];
      try {
        sessionStorage.setItem("kaligan_kb_docs", JSON.stringify(docs || []));
      } catch {}
      setSources(docs || []);
    } catch (err) {
      console.error("Failed to fetch sources:", err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const data = await api.get("/kb/status");
      kbMetricsCache = data;
      try {
        sessionStorage.setItem("kaligan_kb_metrics", JSON.stringify(data));
      } catch {}
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  };

  useEffect(() => {
    const loadInit = async () => {
      await Promise.all([fetchSources(), fetchMetrics()]);
      setLoading(false);
    };
    loadInit();
  }, []);

  // Poll while any document is processing
  useEffect(() => {
    const isProcessing = sources.some((s) => s.status === "processing");
    if (!isProcessing) return;

    const interval = setInterval(() => {
      fetchSources();
      fetchMetrics();
    }, 3000);

    return () => clearInterval(interval);
  }, [sources]);

  const handleDelete = async (id: string) => {
    const previous = [...sources];
    setSources((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.del(`/kb/documents/${id}`);
      fetchMetrics();
    } catch (err: unknown) {
      setSources(previous);
      kbDocsCache = previous;
      const msg = err instanceof Error ? err.message : "Failed to delete document.";
      setSubmitError(msg);
    }
  };

  const handleRetry = async (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "processing", error: null, pct: 0 } : s))
    );
    try {
      await api.post(`/kb/documents/${id}/retry`);
      fetchSources();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retry ingestion.";
      setSubmitError(msg);
      fetchSources();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (sourceType === "file") {
        if (!fileInput) throw new Error("Please select a file to upload.");
        await api.upload("/kb/documents", fileInput);
      } else if (sourceType === "url") {
        if (!urlInput.trim()) throw new Error("Please enter a URL.");
        await api.post("/kb/documents", {
          type: "url",
          url: urlInput.trim(),
          name: urlName.trim() || undefined,
        });
      } else if (sourceType === "faq") {
        const validItems = faqItems.filter((item) => item.q.trim() && item.a.trim());
        if (validItems.length === 0) throw new Error("Please fill in at least one Q&A pair.");
        await api.post("/kb/documents", {
          type: "faq",
          name: faqName.trim() || undefined,
          items: JSON.stringify(validItems),
        });
      }

      setUrlInput("");
      setUrlName("");
      setFileInput(null);
      setFaqName("");
      setFaqItems([{ q: "", a: "" }]);
      setModalOpen(false);

      fetchSources();
      fetchMetrics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to ingest source.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatUpdateDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const handleFaqChange = (idx: number, field: "q" | "a", value: string) => {
    const newItems = [...faqItems];
    newItems[idx][field] = value;
    setFaqItems(newItems);
  };

  const addFaqField = () => setFaqItems([...faqItems, { q: "", a: "" }]);
  const removeFaqField = (idx: number) => setFaqItems(faqItems.filter((_, i) => i !== idx));

  // Category Tabs
  const sourceTabs = ["All", "Documents", "Website", "FAQs", "Policies"];

  const referenceSources = [
    { name: "Refund Policy", detail: "Customer policy document", type: "Policy", updated: "Updated 2h ago", icon: RefreshCw },
    { name: "Shipping Policy", detail: "Fulfillment guidelines", type: "Policy", updated: "Updated 1d ago", icon: PackageOpen },
    { name: "Return Process SOP", detail: "Step-by-step workflow", type: "SOP", updated: "Updated 3d ago", icon: ArrowLeftRight },
    { name: "Product Guide", detail: "Feature and plan details", type: "Document", updated: "Updated 4d ago", icon: BookOpen },
    { name: "Help Center", detail: "Imported website content", type: "Website", updated: "Updated 1w ago", icon: HelpCircle },
  ];

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      const t = s.type.toLowerCase();
      if (activeTab === "Documents" && !["pdf", "docx", "doc", "txt", "md", "csv", "xlsx"].includes(t)) {
        return false;
      }
      if (activeTab === "Website" && t !== "url") {
        return false;
      }
      if (activeTab === "FAQs" && t !== "faq") {
        return false;
      }
      if (activeTab === "Policies" && !s.name.toLowerCase().includes("policy")) {
        return false;
      }

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        return s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q);
      }
      return true;
    });
  }, [sources, activeTab, query]);

  return (
    <div className="space-y-4 max-w-none mx-auto pb-20 animate-fadein min-h-[calc(100vh-2.5rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-[#09090B] tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-[11.5px] text-[#64748B] mt-1 font-normal max-w-2xl">
            Give your AI employees the ground-truth business context to answer accurately, follow SOPs, and complete tasks.
          </p>
        </div>

      </div>
      <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_18px_45px_-38px_rgba(15,23,42,.5)]">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-[16px] font-semibold">Knowledge Base</h2>
          <button onClick={() => setModalOpen(true)} className="g-btn"><Plus className="h-3.5 w-3.5" /> Add source</button>
        </div>
        <div className="grid min-h-[510px] md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b border-border bg-muted/40 p-5 md:border-b-0 md:border-r">
            <div className="flex flex-col gap-1.5">
              {["All Sources", "Documents", "Website", "FAQs", "Policies", "SOPs"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab === "All Sources" ? "All" : tab)} className={`rounded-xl px-4 py-3 text-left text-[13px] transition-colors ${(activeTab === "All" && tab === "All Sources") || activeTab === tab ? "border border-border bg-card font-medium shadow-xs" : "text-muted-foreground hover:bg-card/70"}`}>{tab}</button>
              ))}
            </div>
          </aside>
          <div className="p-6 md:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-[24px] font-medium">Recent Sources</h2>
              <div className="relative hidden sm:block">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sources" className="h-9 w-44 rounded-full border border-border bg-card pl-4 pr-9 text-xs outline-none" />
                <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2.5">
              {referenceSources.filter((item) => !query || item.name.toLowerCase().includes(query.toLowerCase())).map((item) => {
                const Icon = item.icon;
                return <div key={item.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-border px-4 py-3.5 hover:bg-muted/30">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card"><Icon className="h-4 w-4" /></span>
                  <div><h3 className="text-[14px] font-semibold">{item.name}</h3><p className="text-[11.5px] text-muted-foreground">{item.detail}</p></div>
                  <div className="hidden min-w-[210px] grid-cols-2 text-[11.5px] text-muted-foreground sm:grid"><span>{item.type}</span><span className="text-right">{item.updated}</span></div>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Add Knowledge Source Modal ─────────────────────────────────── */}
      <GModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSubmitError(null);
        }}
        title="Add Knowledge Source"
      >
        <div className="flex gap-4 mb-5 border-b border-[#E5E7EB]">
          {(["file", "url", "faq"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setSourceType(tab);
                setSubmitError(null);
              }}
              className={`text-[13px] font-semibold py-2 transition border-b-2 -mb-[1px] cursor-pointer ${
                sourceType === tab
                  ? "border-[#09090B] text-[#09090B]"
                  : "border-transparent text-[#64748B] hover:text-[#09090B]"
              }`}
            >
              {tab === "file" ? "Upload File" : tab === "url" ? "Webpage URL" : "FAQ Q&As"}
            </button>
          ))}
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[12.5px] font-medium leading-relaxed">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {sourceType === "file" && (
            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-[#09090B] mb-1">
                File (PDF, DOCX, XLSX, PPTX, CSV, TXT, MD under 10MB)
              </label>
              <input
                required
                type="file"
                accept=".pdf,.txt,.doc,.docx,.md,.rtf,.csv,.xlsx,.xls,.pptx,.ppt"
                onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                className="w-full text-[13px] text-[#64748B] border border-dashed border-[#E5E7EB] rounded-2xl p-6 text-center cursor-pointer hover:border-gray-400 transition"
              />
              {fileInput && (
                <div className="text-[12.5px] font-semibold text-[#09090B] mt-2">
                  Selected: {fileInput.name} ({(fileInput.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          )}

          {sourceType === "url" && (
            <>
              <div className="mb-3">
                <label className="block text-[12px] font-semibold text-[#09090B] mb-1">
                  Source Name (Optional)
                </label>
                <input
                  className="w-full text-[13px] px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white outline-none focus:border-[#09090B]"
                  placeholder="e.g. Pricing Guide, Support Docs"
                  value={urlName}
                  onChange={(e) => setUrlName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-[#09090B] mb-1">
                  Webpage URL
                </label>
                <input
                  required
                  type="url"
                  className="w-full text-[13px] px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white outline-none focus:border-[#09090B]"
                  placeholder="https://acme.com/pricing"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
            </>
          )}

          {sourceType === "faq" && (
            <>
              <div className="mb-3">
                <label className="block text-[12px] font-semibold text-[#09090B] mb-1">
                  FAQ Collection Name (Optional)
                </label>
                <input
                  className="w-full text-[13px] px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white outline-none focus:border-[#09090B]"
                  placeholder="e.g. Customer Return FAQs"
                  value={faqName}
                  onChange={(e) => setFaqName(e.target.value)}
                />
              </div>
              <div className="max-h-[220px] overflow-y-auto mb-4 pr-1 space-y-2">
                <label className="block text-[12px] font-semibold text-[#09090B]">
                  Q&A Pairs
                </label>
                {faqItems.map((item, idx) => (
                  <div key={idx} className="border border-[#E5E7EB] rounded-xl p-3 bg-[#F8F9FA] relative">
                    {faqItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFaqField(idx)}
                        className="absolute top-2 right-2 text-[11.5px] text-[#94A3B8] hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#09090B] text-[13px] mb-2"
                      placeholder="Question"
                      value={item.q}
                      onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                    />
                    <textarea
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#09090B] text-[13px] min-h-[60px] resize-none"
                      placeholder="Answer"
                      value={item.a}
                      onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFaqField}
                  className="w-full py-1.5 text-[12px] font-semibold text-[#09090B] bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F8F9FA] cursor-pointer"
                >
                  + Add Question
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#09090B] text-white text-[13px] h-[38px] w-full flex items-center justify-center gap-2 mt-2 font-semibold hover:bg-black transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Ingesting knowledge...</span>
              </>
            ) : (
              "Ingest Source"
            )}
          </button>
        </form>
      </GModal>
    </div>
  );
}
