import type { LeadFieldDef } from "../types/template";

export const DEFAULT_LEAD_FIELDS: LeadFieldDef[] = [
  { id: "f_name", label: "Full Name", key: "name", type: "text", required: true, enabled: true },
  { id: "f_email", label: "Work Email", key: "email", type: "email", required: true, enabled: true },
  { id: "f_phone", label: "Phone Number", key: "phone", type: "phone", required: false, enabled: true },
  { id: "f_company", label: "Company Name", key: "company", type: "text", required: false, enabled: true },
  { id: "f_budget", label: "Estimated Budget", key: "budget", type: "text", required: false, enabled: true },
  { id: "f_timeline", label: "Target Go-Live Timeline", key: "timeline", type: "text", required: false, enabled: true },
];
