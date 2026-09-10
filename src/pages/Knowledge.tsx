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
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-fadein">
      {/* ─── Page Title (Exact kaliganai.com Standard) ──────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#09090B] tracking-tight">
            Knowledge Base.
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1.5 font-normal max-w-2xl">
            Give your AI employees the ground-truth business context to answer accurately, follow SOPs, and complete tasks.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#09090B] text-white px-5 py-2.5 text-[13px] font-semibold hover:bg-black transition-all cursor-pointer shadow-xs active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Source</span>
        </button>
      </div>

      {/* ─── 4 Core Capability Cards (From kaliganai.com/features/knowledge-base) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] grid place-items-center text-[#09090B] shadow-2xs">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-[15px] text-[#09090B] mt-3.5 tracking-tight">Collect</h3>
          <p className="text-[12px] text-[#64748B] leading-relaxed mt-1">
            Bring together PDFs, policies, FAQs, product docs, and website pages into one central vault.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] grid place-items-center text-[#09090B] shadow-2xs">
            <FolderTree className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-[15px] text-[#09090B] mt-3.5 tracking-tight">Organize</h3>
          <p className="text-[12px] text-[#64748B] leading-relaxed mt-1">
            Auto-chunk and vectorize content so AI employees instantly locate relevant paragraphs.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] grid place-items-center text-[#09090B] shadow-2xs">
            <Brain className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-[15px] text-[#09090B] mt-3.5 tracking-tight">Understand</h3>
          <p className="text-[12px] text-[#64748B] leading-relaxed mt-1">
            Semantic vector embeddings provide deep contextual awareness across diverse inquiries.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] grid place-items-center text-[#09090B] shadow-2xs">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-[15px] text-[#09090B] mt-3.5 tracking-tight">Act</h3>
          <p className="text-[12px] text-[#64748B] leading-relaxed mt-1">
            Grounded reasoning guarantees trustworthy answers without hallucinations in Voice or Chat.
          </p>
        </div>
      </div>

      {/* ─── Seamless Container (Exact kaliganai.com Standard) ───────────── */}
      <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Full-Width Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search knowledge documents, topics, or FAQs..."
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
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
          <div className="flex flex-wrap gap-2">
            {sourceTabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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

          {metrics && (
            <span className="text-[12px] font-medium text-[#64748B]">
              ~{metrics.topicsApprox} topics indexed across {metrics.sources} source{metrics.sources !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Sources List / Empty State */}
        {loading ? (
          <div className="py-16">
            <Loading label="Loading knowledge base" subtitle="Syncing documents and vector topics" />
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] p-12 text-center my-4 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] grid place-items-center mx-auto text-[#64748B]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#09090B]">No knowledge sources found</h3>
            <p className="text-[#64748B] text-[13px] max-w-sm mx-auto">
              Upload policies, paste Q&As, or link webpage documentation so your AI employees can learn your business.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#09090B] text-white px-4 py-1.5 text-[12.5px] font-semibold hover:bg-black transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add your first source</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden">
            {filteredSources.map((s) => {
              const isProcessing = s.status === "processing";
              const isFailed = s.status === "failed";

              return (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 hover:bg-[#F8F9FA] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] grid place-items-center shrink-0 shadow-2xs font-semibold text-[11px] text-[#09090B] uppercase">
                      {s.type.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[14px] text-[#09090B] truncate">
                        {s.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-[#94A3B8]">
                        <span>{s.chunkCount} vector chunks</span>
                        <span>•</span>
                        <span>Updated {formatUpdateDate(s.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                        <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                        Processing {s.pct}%
                      </span>
                    ) : isFailed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/60">
                        Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Synced
                      </span>
                    )}

                    {isFailed ? (
                      <button
                        onClick={() => handleRetry(s.id)}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#09090B] hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-[#94A3B8] hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Delete source"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
