export interface AgentRecord {
  id: string;
  name: string;
  role: string;
  kind: "chat" | "voice" | "hybrid";
  status: "live" | "draft" | "paused";
  version: string;
  templateId: string;
  category: "Sales" | "Support" | "Ops" | "Scheduling" | "General";
  avatar: string;
  description: string;
  systemPrompt: string;
  greetingMessage: string;
  model: string;
  voiceModel?: string;
  voiceCadence?: string;
  temperature: number;
  connectedTools: string[];
  connectedKbDocumentIds: string[];
  captureFields?: string[];
  totalRuns: number;
  successRate: number;
  avgResponseTimeMs: number;
  conversionRate?: number;
  csat?: number;
  createdAt: string;
  updatedAt: string;
  employeeActions?: any[];
}

export const MOCK_AGENTS: AgentRecord[] = [
  {
    id: "agent-1",
    name: "Medha · Lead Capture Specialist",
    role: "Inbound Lead Capture & Qualification",
    kind: "chat",
    status: "live",
    version: "v2.4",
    templateId: "lead-capture-chat",
    category: "Sales",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    description: "Greets inbound website visitors, answers technical & pricing questions, scores leads, and logs qualified contacts straight to Salesforce and Slack.",
    systemPrompt: "You are Medha, an autonomous Lead Capture Specialist at KaliGan AI. Greet visitors courteously, understand their business use case, ground answers in company knowledge, score their intent, and capture contact information.",
    greetingMessage: "Hello! Welcome to our workspace 👋 How can I help with your project or team requirements today?",
    model: "gemini-2.0-flash",
    temperature: 0.2,
    connectedTools: ["salesforce", "gmail", "slack"],
    connectedKbDocumentIds: ["doc-1", "doc-2", "doc-3"],
    captureFields: ["name", "email", "phone", "company", "budget", "timeline"],
    totalRuns: 18420,
    successRate: 99.2,
    avgResponseTimeMs: 240,
    conversionRate: 24.8,
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-09-02T00:15:00Z",
    employeeActions: [
      { id: "act-1", actionType: "LEAD_CAPTURE", enabled: true },
      { id: "act-2", actionType: "CRM_LEAD_CREATION", enabled: true }
    ]
  },
  {
    id: "agent-2",
    name: "Aarav · Voice Inbound Sales Rep",
    role: "Inbound Phone Sales & Discovery",
    kind: "voice",
    status: "live",
    version: "v1.8",
    templateId: "inbound-sales-calls",
    category: "Sales",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    description: "Answers inbound sales calls on +1 (800) 555-KALI, conducts verbal discovery, and syncs enterprise opportunities to Zoho CRM.",
    systemPrompt: "You are Aarav, an enterprise voice sales representative. Keep verbal responses concise, friendly, and structured. Ask for deal size, timeline, and schedule sales follow-ups.",
    greetingMessage: "Thanks for calling KaliGan AI! My name is Aarav. How can I assist your team today?",
    model: "gemini-2.5-flash-native-audio-preview",
    voiceModel: "gemini-voice-aoede",
    voiceCadence: "natural-fast",
    temperature: 0.15,
    connectedTools: ["zoho", "gmail", "slack"],
    connectedKbDocumentIds: ["doc-1", "doc-4"],
    totalRuns: 8940,
    successRate: 98.7,
    avgResponseTimeMs: 380,
    conversionRate: 31.4,
    createdAt: "2026-08-12T14:30:00Z",
    updatedAt: "2026-09-01T23:45:00Z",
    employeeActions: [
      { id: "act-3", actionType: "VOICE_LEAD_CAPTURE", enabled: true },
      { id: "act-4", actionType: "CRM_LEAD_CREATION", enabled: true }
    ]
  },
  {
    id: "agent-3",
    name: "Maya · ReceiptNest Clinic Scheduler",
    role: "Healthcare & Appointment Coordinator",
    kind: "voice",
    status: "live",
    version: "v3.1",
    templateId: "receiptnest-scheduler",
    category: "Scheduling",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    description: "Answers patient calls, identifies organization/clinic, checks doctor calendars, and books appointments against real-time schedules.",
    systemPrompt: "You are Maya, the autonomous patient coordinator for ReceiptNest Clinics. Verify patient details, verify doctor availability, confirm appointment slots, and send SMS confirmation codes.",
    greetingMessage: "Hello, this is Maya with ReceiptNest Medical Care. Are you calling to book, reschedule, or check an appointment today?",
    model: "gemini-2.5-flash-native-audio-preview",
    voiceModel: "gemini-voice-kore",
    voiceCadence: "calm-professional",
    temperature: 0.1,
    connectedTools: ["calendar", "gmail", "slack"],
    connectedKbDocumentIds: ["doc-5"],
    totalRuns: 12450,
    successRate: 99.8,
    avgResponseTimeMs: 350,
    csat: 4.9,
    createdAt: "2026-08-01T09:00:00Z",
    updatedAt: "2026-09-01T22:20:00Z",
    employeeActions: [
      { id: "act-5", actionType: "APPOINTMENT_BOOKING", enabled: true }
    ]
  },
  {
    id: "agent-4",
    name: "Kavya · Tier-1 Voice Support Rep",
    role: "Customer Support & Incident Escalation",
    kind: "voice",
    status: "live",
    version: "v2.0",
    templateId: "customer-support-calls",
    category: "Support",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    description: "Resolves customer billing and product issues on phone, detects sentiment, and auto-generates categorized Zendesk tickets with live escalation.",
    systemPrompt: "You are Kavya, Tier-1 Customer Support Specialist. Listen actively to issues, verify account status with Stripe/Zendesk, and escalate high-urgency incidents immediately.",
    greetingMessage: "Hello, thank you for reaching KaliGan Support. My name is Kavya. Could you please describe what issue you are experiencing?",
    model: "gemini-2.0-flash",
    voiceModel: "gemini-voice-fenrir",
    voiceCadence: "empathetic-clear",
    temperature: 0.1,
    connectedTools: ["zendesk", "stripe", "slack"],
    connectedKbDocumentIds: ["doc-1", "doc-2"],
    totalRuns: 15300,
    successRate: 97.9,
    avgResponseTimeMs: 410,
    csat: 4.7,
    createdAt: "2026-08-15T11:00:00Z",
    updatedAt: "2026-09-01T21:10:00Z",
    employeeActions: [
      { id: "act-6", actionType: "AUTO_TICKET_CREATION", enabled: true },
      { id: "act-7", actionType: "HUMAN_ESCALATION", enabled: true }
    ]
  },
  {
    id: "agent-5",
    name: "Rohan · BANT Lead Qualification Specialist",
    role: "Sales Qualification & Deal Sizing",
    kind: "chat",
    status: "live",
    version: "v1.5",
    templateId: "lead-qual-chat",
    category: "Sales",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    description: "Conducts conversational BANT qualification to calculate deal sizes and creates deals directly in HubSpot CRM.",
    systemPrompt: "You are Rohan, an autonomous BANT Lead Qualification Specialist. Ask targeted questions to uncover Budget, Authority, Need, and Timeline.",
    greetingMessage: "Hi there! I'm Rohan. Looking to see which KaliGan AI workforce configuration fits your enterprise? Let's explore your requirements.",
    model: "gemini-2.0-flash",
    temperature: 0.15,
    connectedTools: ["hubspot", "slack", "gmail"],
    connectedKbDocumentIds: ["doc-1", "doc-3"],
    totalRuns: 7210,
    successRate: 99.1,
    avgResponseTimeMs: 250,
    conversionRate: 28.5,
    createdAt: "2026-08-20T16:00:00Z",
    updatedAt: "2026-09-01T19:35:00Z",
    employeeActions: [
      { id: "act-8", actionType: "LEAD_QUALIFICATION", enabled: true },
      { id: "act-9", actionType: "CRM_LEAD_CREATION", enabled: true }
    ]
  },
  {
    id: "agent-6",
    name: "Tara · Omnichannel Support & Voice Continuity",
    role: "Hybrid Chat + Voice Support Agent",
    kind: "hybrid",
    status: "live",
    version: "v2.0",
    templateId: "chat-voice-handoff",
    category: "Support",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    description: "Starts in live chat and allows users to click 'Call Tara' to continue the conversation seamlessly via phone without losing context.",
    systemPrompt: "You are Tara, a Hybrid Support Specialist. Preserve all chat history when the customer calls in, reference previous messages, and take business actions.",
    greetingMessage: "Hello! I'm Tara. I can help you via chat right now, or feel free to click the phone icon to speak with me directly with full context.",
    model: "gemini-2.0-flash",
    voiceModel: "gemini-voice-aoede",
    temperature: 0.15,
    connectedTools: ["zendesk", "slack", "gmail"],
    connectedKbDocumentIds: ["doc-1", "doc-2", "doc-3"],
    totalRuns: 9840,
    successRate: 99.4,
    avgResponseTimeMs: 310,
    csat: 4.85,
    createdAt: "2026-08-25T12:00:00Z",
    updatedAt: "2026-09-01T18:00:00Z",
    employeeActions: [
      { id: "act-10", actionType: "OMNICHANNEL_CONTINUITY", enabled: true }
    ]
  }
];
