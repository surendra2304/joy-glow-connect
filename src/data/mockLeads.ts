export interface MockLead {
  id: string;
  agentId: string;
  agentName: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  score: number;
  scoreCategory: "Hot" | "Warm" | "Cold";
  intentSummary: string;
  crmStatus: "synced_salesforce" | "synced_hubspot" | "synced_zoho" | "pending";
  crmRecordId?: string;
  capturedAt: string;
  timeAgo: string;
  customFields?: Record<string, any>;
}

export const MOCK_LEADS: MockLead[] = [
  {
    id: "lead-101",
    agentId: "agent-1",
    agentName: "Medha · Lead Capture Specialist",
    name: "Alex Rivera",
    email: "alex@acme.com",
    phone: "+1 (415) 890-2190",
    company: "Acme Enterprise",
    score: 94,
    scoreCategory: "Hot",
    intentSummary: "50-seat enterprise plan evaluating sub-400ms voice agents with pgvector grounding.",
    crmStatus: "synced_salesforce",
    crmRecordId: "00Q5g00000abc12XYZ",
    capturedAt: "2026-09-02T00:15:32.000Z",
    timeAgo: "25 mins ago",
    customFields: {
      budget: "$36,000 / yr",
      timeline: "Immediate (Q3)",
      seats: 50
    }
  },
  {
    id: "lead-102",
    agentId: "agent-1",
    agentName: "Medha · Lead Capture Specialist",
    name: "Sarah Jenkins",
    email: "sarah.j@globaltech.io",
    phone: "+1 (212) 555-0149",
    company: "GlobalTech Solutions",
    score: 88,
    scoreCategory: "Hot",
    intentSummary: "Looking for omnichannel chat + voice customer support automation for Zendesk.",
    crmStatus: "synced_salesforce",
    crmRecordId: "00Q5g00000abc13XYZ",
    capturedAt: "2026-09-01T23:30:00.000Z",
    timeAgo: "1 hour ago",
    customFields: {
      budget: "$50,000 / yr",
      timeline: "Next 30 days",
      seats: 80
    }
  },
  {
    id: "lead-103",
    agentId: "agent-2",
    agentName: "Aarav · Voice Inbound Sales Rep",
    name: "Priya Sharma",
    email: "priya@fintechscale.io",
    phone: "+1 (650) 420-9912",
    company: "FinTech Scale Corp",
    score: 91,
    scoreCategory: "Hot",
    intentSummary: "Inbound phone call asking for dedicated SIP trunking and high-concurrency telephony.",
    crmStatus: "synced_zoho",
    crmRecordId: "ZH_99210481",
    capturedAt: "2026-09-01T23:42:10.000Z",
    timeAgo: "50 mins ago",
    customFields: {
      budget: "$60,000 / yr",
      timeline: "Immediate",
      seats: 120
    }
  },
  {
    id: "lead-104",
    agentId: "agent-5",
    agentName: "Rohan · BANT Lead Qualification Specialist",
    name: "Marcus Vance",
    email: "mvance@cloudsystems.net",
    phone: "+1 (312) 555-0182",
    company: "Cloud Systems Inc",
    score: 76,
    scoreCategory: "Warm",
    intentSummary: "BANT assessment: Needs compliance SOC2 report before purchasing 20 seats.",
    crmStatus: "synced_hubspot",
    crmRecordId: "hs_deal_889120",
    capturedAt: "2026-09-01T19:30:00.000Z",
    timeAgo: "5 hours ago",
    customFields: {
      budget: "$20,000 / yr",
      timeline: "Q4",
      seats: 20
    }
  }
];
