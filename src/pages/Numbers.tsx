import { useState, useEffect, useMemo } from "react";
import { GModal, Loading } from "../components/grok";
import { api } from "../lib/api";
import {
  Phone,
  Search,
  X,
  Plus,
  Radio,
  Clock,
  Zap,
  CheckCircle2,
} from "lucide-react";

export interface PhoneNumberItem {
  id: string;
  phoneNumber: string;
  friendlyName: string;
  country: string;
  type: string;
  status: string;
  assignedAgent: string;
  assignedAgentRole: string;
  capabilities: string[];
  monthlyCost: string;
  totalCalls: number;
  minutesUsed: number;
}

export function Numbers() {
  const [numbers, setNumbers] = useState<PhoneNumberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [areaCode, setAreaCode] = useState("415");
  const [numberType, setNumberType] = useState<"local" | "toll-free">("local");
  const [friendlyNameInput, setFriendlyNameInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Vani");
  const [provisioning, setProvisioning] = useState(false);

  // Filters
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  useEffect(() => {
    const fetchNumbers = async () => {
      setLoading(true);
      try {
        const data = await api.get("/telephony/numbers");
        const mapped = data.map((n: any) => ({
          id: n.id,
          phoneNumber: n.e164,
          friendlyName: n.friendlyName || n.e164,
          country: "US",
          type: "Local",
          status: n.status || "active",
          assignedAgent: n.agent?.name || "Unassigned",
          assignedAgentRole: n.agent?.role || "Voice Representative",
          capabilities: ["Voice"],
          monthlyCost: "$1.15/mo",
          totalCalls: 0,
          minutesUsed: 0,
        }));
        setNumbers(mapped);
      } catch (err) {
        console.error("Failed to load numbers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNumbers();
  }, []);

  const handleBuyNumber = () => {
    setProvisioning(true);
    setTimeout(() => {
      const generated =
        numberType === "toll-free"
          ? `+1 (888) 555-0${Math.floor(100 + Math.random() * 900)}`
          : `+1 (${areaCode || "415"}) 555-0${Math.floor(100 + Math.random() * 900)}`;

      const newNum: PhoneNumberItem = {
        id: `num_${Date.now()}`,
        phoneNumber: generated,
        friendlyName: friendlyNameInput.trim() || `${areaCode || "Local"} Direct Line`,
        country: "US",
        type: numberType === "toll-free" ? "Toll-Free" : `Local (${areaCode || "415"})`,
        status: "active",
        assignedAgent: selectedAgent,
        assignedAgentRole: "Voice Representative",
        capabilities: ["Voice", "SMS"],
        monthlyCost: numberType === "toll-free" ? "$2.00/mo" : "$1.15/mo",
        totalCalls: 0,
        minutesUsed: 0,
      };

      setNumbers([newNum, ...numbers]);
      setProvisioning(false);
      setModalOpen(false);
      setFriendlyNameInput("");
    }, 700);
  };

  const totalMinutes = numbers.reduce((acc, n) => acc + n.minutesUsed, 0);
  const totalCalls = numbers.reduce((acc, n) => acc + n.totalCalls, 0);

  const filterTabs = ["All", "Local", "Toll-Free", "Assigned", "Unassigned"];

  const filteredNumbers = useMemo(() => {
    return numbers.filter((item) => {
      if (selectedFilter === "Local" && !item.type.includes("Local")) return false;
      if (selectedFilter === "Toll-Free" && !item.type.includes("Toll-Free")) return false;
      if (selectedFilter === "Assigned" && item.assignedAgent === "Unassigned") return false;
      if (selectedFilter === "Unassigned" && item.assignedAgent !== "Unassigned") return false;

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        return (
          item.phoneNumber.toLowerCase().includes(q) ||
          item.friendlyName.toLowerCase().includes(q) ||
          item.assignedAgent.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [numbers, selectedFilter, query]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-fadein">
      {/* ─── Page Title (Exact kaliganai.com Standard) ──────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#09090B] tracking-tight">
            Phone Numbers.
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1.5 font-normal max-w-2xl">
            Provision virtual phone lines, configure telephony trunks, and route inbound phone calls to Voice AI Employees.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#09090B] text-white px-5 py-2.5 text-[13px] font-semibold hover:bg-black transition-all cursor-pointer shadow-xs active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Get New Number</span>
        </button>
      </div>

      {/* ─── Telephony KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#64748B]">Active Lines</span>
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <div className="text-[26px] font-bold mt-1 text-[#09090B] tracking-tight">
            {numbers.length} {numbers.length === 1 ? "Line" : "Lines"}
          </div>
          <span className="text-[11.5px] text-emerald-600 font-medium mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            100% Operational
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#64748B]">Voice Usage</span>
            <Clock className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="text-[26px] font-bold mt-1 text-[#09090B] tracking-tight">
            {totalMinutes.toLocaleString()} Mins
          </div>
          <span className="text-[11.5px] text-[#64748B] mt-1 inline-block">
            Across active voice agents
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#64748B]">Calls Processed</span>
            <Phone className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="text-[26px] font-bold mt-1 text-[#09090B] tracking-tight">
            {totalCalls.toLocaleString()} Calls
          </div>
          <span className="text-[11.5px] text-emerald-600 font-medium mt-1 inline-block">
            Live SIP telephony bridge
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#64748B]">Voice Latency</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-[26px] font-bold mt-1 text-[#09090B] tracking-tight">
            340 ms
          </div>
          <span className="text-[11.5px] text-emerald-600 font-medium mt-1 inline-block">
            Ultra-low latency audio
          </span>
        </div>
      </div>

      {/* ─── Seamless Container (Exact kaliganai.com Standard) ───────────── */}
      <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Full-Width Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search phone numbers, labels, or assigned employees..."
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
            {filterTabs.map((tab) => {
              const active = selectedFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
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

          <span className="text-[12px] font-medium text-[#64748B]">
            {filteredNumbers.length} active phone lines configured
          </span>
        </div>

        {/* Lines List / Empty State */}
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loading label="Loading phone numbers" subtitle="Fetching connected telephony infrastructure..." />
          </div>
        ) : filteredNumbers.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] p-12 text-center my-4 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] grid place-items-center mx-auto text-[#64748B]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#09090B]">No phone numbers found</h3>
            <p className="text-[#64748B] text-[13px] max-w-sm mx-auto">
              Provision a new virtual local or toll-free number to begin receiving voice calls.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#09090B] text-white px-4 py-1.5 text-[12.5px] font-semibold hover:bg-black transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Get your first number</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden">
            {filteredNumbers.map((numberItem) => (
              <div
                key={numberItem.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 hover:bg-[#F8F9FA] transition-colors"
              >
                {/* Phone Number & Type */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] grid place-items-center shrink-0 shadow-2xs text-[#09090B]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[14.5px] text-[#09090B] font-mono block">
                      {numberItem.phoneNumber}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-[#94A3B8]">
                      <span>{numberItem.friendlyName}</span>
                      <span>•</span>
                      <span>{numberItem.type}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Voice Employee */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#09090B] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                    {numberItem.assignedAgent.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-[13px] text-[#09090B] block leading-tight">
                      {numberItem.assignedAgent}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {numberItem.assignedAgentRole}
                    </span>
                  </div>
                </div>

                {/* Status & Rate */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>

                  <span className="text-[12px] font-semibold text-[#09090B] min-w-[65px] text-right">
                    {numberItem.monthlyCost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Provision Number Modal ─────────────────────────────────────── */}
      <GModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Provision Virtual Phone Line"
      >
        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1.5">
              Line Modality
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setNumberType("local")}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  numberType === "local"
                    ? "border-[#09090B] bg-[#F8F9FA] shadow-2xs"
                    : "border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]"
                }`}
              >
                <div className="font-bold text-[13px] text-[#09090B]">Local Number</div>
                <p className="text-[11px] text-[#64748B] mt-0.5">Area-code tailored ($1.15/mo)</p>
              </div>

              <div
                onClick={() => setNumberType("toll-free")}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  numberType === "toll-free"
                    ? "border-[#09090B] bg-[#F8F9FA] shadow-2xs"
                    : "border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]"
                }`}
              >
                <div className="font-bold text-[13px] text-[#09090B]">Toll-Free</div>
                <p className="text-[11px] text-[#64748B] mt-0.5">888 / 800 line ($2.00/mo)</p>
              </div>
            </div>
          </div>

          {numberType === "local" && (
            <div>
              <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1">
                US Area Code
              </label>
              <input
                type="text"
                placeholder="415, 212, 310..."
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
                className="w-full text-[13px] px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white outline-none focus:border-[#09090B]"
              />
            </div>
          )}

          <div>
            <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1">
              Friendly Label (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Sales Inbound Hotline"
              value={friendlyNameInput}
              onChange={(e) => setFriendlyNameInput(e.target.value)}
              className="w-full text-[13px] px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white outline-none focus:border-[#09090B]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#09090B] mb-1">
              Route Incoming Calls To
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full text-[13px] font-medium text-[#09090B] bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#09090B]"
            >
              <option value="Vani">Vani — Inbound Phone Sales Specialist</option>
              <option value="Vedant">Vedant — Customer Support Voice Rep</option>
              <option value="Aarya">Aarya — Appointment Scheduling Rep</option>
            </select>
          </div>

          <button
            onClick={handleBuyNumber}
            disabled={provisioning}
            className="rounded-full bg-[#09090B] text-white text-[13px] h-[38px] w-full flex items-center justify-center gap-2 mt-2 font-semibold hover:bg-black transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {provisioning ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Provisioning virtual number...</span>
              </>
            ) : (
              "Confirm & Provision Number"
            )}
          </button>
        </div>
      </GModal>
    </div>
  );
}
