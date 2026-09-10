import { useState, useMemo } from "react";
import { MOCK_BOOKINGS } from "../data/mockBookings";
import * as I from "./icons";

interface AgentBookingsTabProps {
  agentId: string;
}

export function AgentBookingsTab({ agentId }: AgentBookingsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const bookings = useMemo(() => {
    const directMatches = MOCK_BOOKINGS.filter(b => b.agentId === agentId);
    return directMatches.length > 0 ? directMatches : MOCK_BOOKINGS;
  }, [agentId]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedStatus !== "all" && b.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.patientOrClientName.toLowerCase().includes(q) ||
          b.organization.toLowerCase().includes(q) ||
          b.serviceOrDoctor.toLowerCase().includes(q) ||
          b.confirmationCode.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookings, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6 animate-fadein">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[var(--g-radius-lg)] border border-[var(--g-border)] bg-[var(--g-surface)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-semibold text-[16px] text-[var(--g-foreground)]">Appointments &amp; Bookings Scheduled</h3>
          </div>
          <p className="text-[13px] text-[var(--g-muted-foreground)]">
            Real-time appointment schedule coordinated against organizational calendars.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-[var(--g-secondary)] border border-[var(--g-border-light)] text-center">
            <div className="text-[11px] font-semibold text-[var(--g-muted-foreground)] uppercase">Total Bookings</div>
            <div className="text-[16px] font-bold text-[var(--g-foreground)]">{bookings.length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[11px] font-semibold text-emerald-600 uppercase">Sync Status</div>
            <div className="text-[16px] font-bold text-emerald-700">100% Calendar Synced</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto g-no-scrollbar">
          {["all", "confirmed", "rescheduled", "completed"].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold capitalize transition-colors cursor-pointer border ${
                selectedStatus === st
                  ? "bg-[#09090B] text-white border-[#09090B]"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#09090B] hover:text-[#09090B]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search patient, doctor, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[13px] rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] focus:outline-none focus:border-[var(--g-foreground)] transition-colors"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--g-muted-foreground)] pointer-events-none">
            <I.Search width={13} height={13} />
          </span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="border border-[var(--g-border)] rounded-[var(--g-radius-lg)] bg-[var(--g-surface)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--g-border-light)] bg-[var(--g-secondary)] text-[11px] font-semibold text-[var(--g-muted-foreground)] uppercase tracking-wider">
                <th className="py-3 px-4">Patient / Client</th>
                <th className="py-3 px-4">Organization &amp; Doctor</th>
                <th className="py-3 px-4">Scheduled Time</th>
                <th className="py-3 px-4">Sync &amp; Code</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--g-border-light)]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[var(--g-secondary)]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[13.5px] text-[var(--g-foreground)]">{b.patientOrClientName}</div>
                    <div className="text-[12px] text-[var(--g-muted-foreground)]">{b.contactPhone} · {b.contactEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[13px] text-[var(--g-foreground)]">{b.organization}</div>
                    <div className="text-[12px] text-emerald-600 font-medium">{b.serviceOrDoctor}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[13px] text-[var(--g-foreground)]">
                    <div>{b.scheduledTime}</div>
                    <div className="text-[11.5px] text-[var(--g-muted-foreground)]">Duration: {b.durationMinutes} mins</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[12px] px-2 py-0.5 rounded bg-[var(--g-secondary)] border border-[var(--g-border-light)] font-bold text-[var(--g-foreground)]">
                      {b.confirmationCode}
                    </span>
                    <div className="text-[11px] text-[var(--g-muted-foreground)] mt-0.5">Google Calendar Synced</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      b.status === "confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                      b.status === "rescheduled" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                      "bg-[var(--g-secondary)] text-[var(--g-muted-foreground)]"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
