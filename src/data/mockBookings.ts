export interface BookingRecord {
  id: string;
  agentId: string;
  patientOrClientName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
  serviceOrDoctor: string;
  scheduledTime: string;
  durationMinutes: number;
  status: "confirmed" | "completed" | "rescheduled" | "cancelled";
  calendarSync: "google_calendar" | "outlook" | "internal";
  notes: string;
  confirmationCode: string;
}

export const MOCK_BOOKINGS: BookingRecord[] = [
  {
    id: "bk-901",
    agentId: "agent-3",
    patientOrClientName: "David Miller",
    contactEmail: "david.miller@email.com",
    contactPhone: "+1 (206) 555-0144",
    organization: "Metro Health Cardiology Clinic",
    serviceOrDoctor: "Dr. Eleanor Harrison",
    scheduledTime: "Sep 4, 2026 at 2:30 PM",
    durationMinutes: 45,
    status: "confirmed",
    calendarSync: "google_calendar",
    notes: "Follow-up consultation after ECG review. Requested wheelchair assistance on arrival.",
    confirmationCode: "RN-8942"
  },
  {
    id: "bk-902",
    agentId: "agent-3",
    patientOrClientName: "Samantha Chen",
    contactEmail: "samantha.c@acme.org",
    contactPhone: "+1 (415) 555-0188",
    organization: "Pacific Bay Dermatology",
    serviceOrDoctor: "Dr. Marcus Vance",
    scheduledTime: "Sep 5, 2026 at 10:00 AM",
    durationMinutes: 30,
    status: "confirmed",
    calendarSync: "google_calendar",
    notes: "Annual skin check and prescription renewal.",
    confirmationCode: "RN-8943"
  },
  {
    id: "bk-903",
    agentId: "agent-3",
    patientOrClientName: "Robert Taylor",
    contactEmail: "rtaylor@apexcorp.com",
    contactPhone: "+1 (312) 555-0199",
    organization: "Apex Dental Specialists",
    serviceOrDoctor: "Dr. Chloe Adams",
    scheduledTime: "Sep 6, 2026 at 11:15 AM",
    durationMinutes: 60,
    status: "rescheduled",
    calendarSync: "outlook",
    notes: "Rescheduled from Sep 3 due to caller travel conflict.",
    confirmationCode: "RN-8944"
  }
];
