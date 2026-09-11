import { CubeIcon } from "@/components/CubeIcon";
import marketplaceHero from "../assets/figma/marketplace-hero-v2.png.asset.json";
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  EMPLOYEE_TEMPLATES,
  CANONICAL_CATEGORIES,
} from "../data/canonicalCatalog";
import type { EmployeeTemplate } from "../data/canonicalCatalog";
import { renderConnectorIcon } from "../components/renderConnectorIcon";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { AgentAvatar } from "../components/ui/agent-avatar";
import {

  Search,
  Sparkles,
  X,
  Play,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Upload,
  SlidersHorizontal,
  Check,
} from "lucide-react";

export default function Templates() {
  const navigate = useNavigate();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "name" | "channel">("featured");

  // Spotlight index (carousel between 3 top picks)
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  // Publish Modal State
  const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);
  const [publishForm, setPublishForm] = useState({
    agentName: "",
    role: "",
    category: "Customer Support",
    channel: "chat",
    organization: "Acme Corp",
    distribution: "public",
  });
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  // Spotlight agents (Sales, Support, Scheduling)
  const spotlightAgents = useMemo(() => {
    const sales = EMPLOYEE_TEMPLATES.find((t) => t.id.includes("sales") || t.category === "Sales & Revenue") || EMPLOYEE_TEMPLATES[0];
    const support = EMPLOYEE_TEMPLATES.find((t) => t.id.includes("support") || t.category === "Customer Support") || EMPLOYEE_TEMPLATES[7];
    const scheduler = EMPLOYEE_TEMPLATES.find((t) => t.id.includes("booking") || t.category === "Scheduling & Appointments") || EMPLOYEE_TEMPLATES[2];
    return [sales, support, scheduler];
  }, []);

  const activeSpotlight = spotlightAgents[spotlightIndex] || spotlightAgents[0];

  // Quick Tags
  const quickTags = [
    { label: "Lead Capture", value: "lead" },
    { label: "Phone Support", value: "voice" },
    { label: "Appointment Booking", value: "booking" },
    { label: "CRM Sync", value: "salesforce" },
    { label: "Ticket Resolution", value: "ticket" },
    { label: "Retention & Renewal", value: "renewal" },
  ];

  // Filtering Logic
  const filteredTemplates = useMemo(() => {
    const list = EMPLOYEE_TEMPLATES.filter((tpl) => {
      // 1. Category Filter
      if (selectedCategory !== "All" && tpl.category !== selectedCategory) {
        return false;
      }

      // 2. Channel Filter
      if (selectedChannel !== "All" && tpl.channel.toLowerCase() !== selectedChannel.toLowerCase()) {
        return false;
      }

      // 3. Publisher Filter
      if (selectedPublisher === "community") {
        return false; // For now all 48 are first-party core agents
      }

      // 4. Quick Tag Filter
      if (selectedTag) {
        const tagLower = selectedTag.toLowerCase();
        const matchesTag =
          tpl.name.toLowerCase().includes(tagLower) ||
          tpl.role.toLowerCase().includes(tagLower) ||
          tpl.channel.toLowerCase().includes(tagLower) ||
          tpl.capabilities.some((c) => c.toLowerCase().includes(tagLower)) ||
          tpl.requiredConnectors.some((conn) => conn.toLowerCase().includes(tagLower));
        if (!matchesTag) return false;
      }

      // 5. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(q);
        const matchesRole = tpl.role.toLowerCase().includes(q);
        const matchesHeadline = tpl.headline.toLowerCase().includes(q);
        const matchesDescription = tpl.description.toLowerCase().includes(q);
        const matchesCategory = tpl.category.toLowerCase().includes(q);
        const matchesCapabilities = tpl.capabilities.some((c) => c.toLowerCase().includes(q));
        const matchesConnectors = tpl.requiredConnectors.some((conn) => conn.toLowerCase().includes(q));

        return (
          matchesName ||
          matchesRole ||
          matchesHeadline ||
          matchesDescription ||
          matchesCategory ||
          matchesCapabilities ||
          matchesConnectors
        );
      }

      return true;
    });

    // Sorting
    if (sortBy === "name") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "channel") {
      return [...list].sort((a, b) => a.channel.localeCompare(b.channel));
    }
    return list;
  }, [selectedCategory, selectedChannel, selectedPublisher, selectedTag, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedChannel("All");
    setSelectedPublisher("All");
    setSelectedTag(null);
    setSearchQuery("");
    setSortBy("featured");
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsPublishOpen(false);
      setPublishForm({
        agentName: "",
        role: "",
        category: "Customer Support",
        channel: "chat",
        organization: "Acme Corp",
        distribution: "public",
      });
    }, 1800);
  };

  const channelOptions = ["All", "Chat", "Voice", "Hybrid"];

  return (
    <div className="space-y-4 max-w-none mx-auto pb-20 animate-fadein min-h-[calc(100vh-2.5rem)]">
      {/* ─── 1. TOP MARKETPLACE HEADER ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Agent Marketplace
            </h1>
            <Badge
              variant="brand"
              className="font-semibold text-xs rounded-full px-2.5 bg-[#09090B] text-white"
            >
              {filteredTemplates.length} Verified
            </Badge>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Official KaliGan Core
            </span>
          </div>
          <p className="text-[11.5px] text-muted-foreground mt-1 font-normal max-w-xl">
            Discover, test, and deploy verified AI agents for autonomous enterprise workflows across Voice, Chat, and CRM systems.
          </p>
        </div>

        {/* Header Action Buttons & Search */}
        <div className="flex items-center gap-2.5 flex-wrap lg:flex-nowrap">
          {/* Search Input */}
          <div className="relative min-w-[200px] sm:w-60">
            <Input
              type="text"
              placeholder="Search agents, skills, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 text-[13px] rounded-full border-[#E5E7EB] bg-white text-[#09090B] placeholder-[#94A3B8] shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#09090B] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Agent Studio Link */}
          <Button
            onClick={() => navigate({ to: "/app/studio" })}
            variant="outline"
            className="rounded-full px-3.5 py-2 text-[13px] cursor-pointer gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="hidden sm:inline">Studio</span>
          </Button>

          {/* Publish Agent to Marketplace Button */}
          <Button
            onClick={() => setIsPublishOpen(true)}
            variant="default"
            className="rounded-full px-4 py-2 text-[13px] shadow-xs cursor-pointer gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Publish Agent</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. FEATURED SPOTLIGHT HERO BANNER ────────────────────────────── */}
      {!searchQuery && selectedCategory === "All" && selectedChannel === "All" && (
        <div className="relative overflow-hidden rounded-[20px]">
          <img
            src={marketplaceHero.url}
            alt="AI Employee Marketplace — discover AI employees built for real work"
            className="block w-full h-auto"
          />
          <button
            type="button"
            aria-label="Browse AI Employees"
            onClick={() => document.getElementById("marketplace-filters")?.scrollIntoView({ behavior: "smooth" })}
            className="absolute left-[2.4%] top-[76%] h-[16%] w-[15%] cursor-pointer rounded-full"
          />
          <button
            type="button"
            aria-label="How it works"
            onClick={() => navigate({ to: "/app/studio" })}
            className="absolute left-[18.5%] top-[76%] h-[16%] w-[10.5%] cursor-pointer rounded-full"
          />
        </div>
      )}

      {/* ─── 3. MARKETPLACE NAVIGATION & CATEGORY TABS ────────────────────── */}
      <div id="marketplace-filters" className="space-y-3.5 pt-1">
        {/* Category Pills Strip */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedTag(null);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-all cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#09090B] text-white shadow-xs font-semibold"
                  : "bg-white border border-[#E5E7EB] text-[#64748B] hover:text-[#09090B] hover:bg-[#F4F5F6]"
              }`}
            >
              All Categories
            </button>
            {CANONICAL_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedTag(null);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-[#09090B] text-white shadow-xs font-semibold"
                      : "bg-white border border-[#E5E7EB] text-[#64748B] hover:text-[#09090B] hover:bg-[#F4F5F6]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Channel Filters Pill */}
          <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-full border border-[#E5E7EB] self-start sm:self-auto shrink-0">
            {channelOptions.map((ch) => {
              const active = selectedChannel === ch;
              return (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-3 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-white text-[#09090B] font-semibold shadow-2xs"
                      : "text-[#64748B] hover:text-[#09090B]"
                  }`}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Marketplace Filter Row: Quick Tags & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#F1F5F9]">
          {/* Quick Filter Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11.5px] font-medium text-[#94A3B8] mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Quick Tags:
            </span>
            {quickTags.map((tag) => {
              const isSelected = selectedTag === tag.value;
              return (
                <button
                  key={tag.value}
                  onClick={() => setSelectedTag(isSelected ? null : tag.value)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#09090B] text-white font-semibold"
                      : "bg-[#F8F9FA] border border-[#E5E7EB] text-[#64748B] hover:text-[#09090B] hover:bg-[#EEF0F2]"
                  }`}
                >
                  #{tag.label.toLowerCase().replace(/\s+/g, "-")}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] text-[#DC2626] hover:underline font-medium cursor-pointer ml-1"
              >
                Clear tag
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ─── 5. PUBLISH AGENT TO MARKETPLACE MODAL ───────────────────────── */}
      <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
        <DialogContent onClose={() => setIsPublishOpen(false)} className="max-w-lg">
          <DialogHeader>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-[#09090B] border border-slate-200 grid place-items-center mb-1">
              <Upload className="w-5 h-5 text-[#09090B]" />
            </div>
            <DialogTitle>Publish Agent to Marketplace</DialogTitle>
            <DialogDescription>
              Share your custom AI Employee with your organization or the public KaliGan ecosystem. Submissions undergo automated capability tests and security verification.
            </DialogDescription>
          </DialogHeader>

          {publishSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 grid place-items-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#09090B]">Agent Submitted for Verification!</h3>
              <p className="text-[13px] text-[#64748B] max-w-sm mx-auto">
                Our automated validator is auditing your agent prompt, tool schemas, and sandboxed execution. You will receive an in-app notification once approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePublishSubmit} className="space-y-4 py-1">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1">
                  Agent Name
                </label>
                <Input
                  required
                  placeholder="e.g. Healthcare Intake Specialist"
                  value={publishForm.agentName}
                  onChange={(e) => setPublishForm({ ...publishForm, agentName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1">
                    Department Category
                  </label>
                  <select
                    value={publishForm.category}
                    onChange={(e) => setPublishForm({ ...publishForm, category: e.target.value })}
                    className="w-full text-[13px] font-medium text-[#09090B] bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {CANONICAL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1">
                    Channel Modality
                  </label>
                  <select
                    value={publishForm.channel}
                    onChange={(e) => setPublishForm({ ...publishForm, channel: e.target.value })}
                    className="w-full text-[13px] font-medium text-[#09090B] bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="chat">Chat AI</option>
                    <option value="voice">Voice AI</option>
                    <option value="hybrid">Hybrid Omnichannel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1">
                  Publisher / Organization Name
                </label>
                <Input
                  required
                  placeholder="e.g. Acme Corp AI Team"
                  value={publishForm.organization}
                  onChange={(e) => setPublishForm({ ...publishForm, organization: e.target.value })}
                />
              </div>

              {/* Distribution Mode */}
              <div>
                <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1.5">
                  Marketplace Distribution
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setPublishForm({ ...publishForm, distribution: "private" })}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      publishForm.distribution === "private"
                        ? "border-[#09090B] bg-[#F8F9FA] shadow-2xs"
                        : "border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#09090B]">
                      <span>Private Workspace</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Visible only to users within your organization.
                    </p>
                  </div>

                  <div
                    onClick={() => setPublishForm({ ...publishForm, distribution: "public" })}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      publishForm.distribution === "public"
                        ? "border-[#09090B] bg-[#F8F9FA] shadow-2xs"
                        : "border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#09090B]">
                      <span>Public Marketplace</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        V2 Beta
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Listed publicly after security and prompt verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] p-3 space-y-1.5 text-[11.5px] text-[#475569]">
                <div className="font-semibold text-[#09090B] text-[12px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Automated Security & Quality Guardrails:
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>No hardcoded API credentials or confidential secrets in prompts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Sandboxed runtime execution without unauthenticated side-effects</span>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPublishOpen(false)}
                  className="rounded-full px-4 text-[13px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="rounded-full px-5 text-[13px]"
                >
                  Submit for Verification
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
