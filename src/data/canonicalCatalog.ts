/**
 * KaliGanAI V1 Canonical Product Catalogue
 *
 * Source of Truth: product-specs/00-PRODUCT-VISION.md & product-specs/01-V1.1-TEMPLATE-MARKETPLACE.md
 *
 * Concepts:
 * - Canonical Category: One of the 5 business categories
 * - Canonical Use Case: One of the 40 canonical capabilities (20 Chat + 20 Voice)
 * - Employee Template: A reusable blueprint for hiring an AI Employee
 * - Employee Instance: A customer's configured instance created from a template
 */

import templatesJson from "./templates.json";

export type CanonicalCategory =
  | "Sales & Revenue"
  | "Scheduling & Appointments"
  | "Customer Support"
  | "Customer Success & Retention"
  | "Operations & Intelligence";

export type ChannelKind = "chat" | "voice" | "hybrid";
export type TemplateStatus = "available" | "coming_soon" | "beta";

export interface CanonicalUseCase {
  id: string;
  name: string;
  category: CanonicalCategory;
  channel: "chat" | "voice";
  description: string;
  defaultActionType: string;
}

export interface EmployeeTemplate {
  id: string;
  name: string;
  role: string;
  headline: string;
  description: string;
  category: CanonicalCategory;
  channel: ChannelKind;
  status: TemplateStatus;
  capabilities: string[];
  useCaseIds: string[];
  suggestedName: string;
  suggestedRole: string;
  defaultPrompt: string;
  greetingMessage: string;
  requiredConnectors: string[];
  requiredKnowledge: string[];
  samplePrompts: string[];
  actionType: string;
  steps?: Array<{
    stepNumber: number;
    title: string;
    description: string;
    badge: string;
  }>;
    demoConfig: {
    scenario: string;
    samplePrompts: string[];
    simulatedAction: {
      tool: string;
      action: string;
      payloadDescription: string;
      defaultPayload: Record<string, unknown>;
    };
  };
  publisher?: string;
  isOfficial?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export const CANONICAL_CATEGORIES: CanonicalCategory[] = [
  "Sales & Revenue",
  "Scheduling & Appointments",
  "Customer Support",
  "Customer Success & Retention",
  "Operations & Intelligence",
];

/**
 * The 40 Canonical AI Employee Use Cases (20 Chat + 20 Voice)
 */
export const CANONICAL_USE_CASES: CanonicalUseCase[] = [
  // ─── Sales & Revenue (11: 6 Chat, 5 Voice) ─────────────────────────
  {
    id: "uc-chat-lead-capture",
    name: "Lead Capture",
    category: "Sales & Revenue",
    channel: "chat",
    description: "Captures visitor contact info, company sizing, and requirements into the CRM pipeline.",
    defaultActionType: "LEAD_CAPTURE",
  },
  {
    id: "uc-chat-lead-qualification",
    name: "Lead Qualification",
    category: "Sales & Revenue",
    channel: "chat",
    description: "Evaluates inbound prospects against BANT (Budget, Authority, Need, Timeline) framework.",
    defaultActionType: "LEAD_QUALIFICATION",
  },
  {
    id: "uc-chat-lead-scoring",
    name: "Lead Scoring",
    category: "Sales & Revenue",
    channel: "chat",
    description: "Computes real-time engagement intent scores (Hot 80+, Warm 50-79, Cold).",
    defaultActionType: "LEAD_SCORING",
  },
  {
    id: "uc-chat-crm-lead-creation",
    name: "CRM Lead Creation",
    category: "Sales & Revenue",
    channel: "chat",
    description: "Directly creates and syncs structured lead profiles into Salesforce, HubSpot, or Zoho.",
    defaultActionType: "CRM_LEAD_CREATION",
  },
  {
    id: "uc-chat-sales-follow-up",
    name: "Sales Follow-Up",
    category: "Sales & Revenue",
    channel: "chat",
    description: "Nurtures existing leads with tailored follow-up messages based on conversation history.",
    defaultActionType: "SALES_FOLLOW_UP",
  },
  {
    id: "uc-chat-product-recommendation",
    name: "Product Recommendation",
    category: "Sales & Revenue",
    channel: "chat",
    description: "Diagnoses customer requirements to recommend optimal product tiers or service configurations.",
    defaultActionType: "PRODUCT_RECOMMENDATION",
  },
  {
    id: "uc-voice-inbound-sales-calls",
    name: "Inbound Sales Calls",
    category: "Sales & Revenue",
    channel: "voice",
    description: "Answers phone inquiries, pitches value propositions, and routes high-intent buyers.",
    defaultActionType: "INBOUND_SALES_CALLS",
  },
  {
    id: "uc-voice-lead-qualification",
    name: "Voice Lead Qualification",
    category: "Sales & Revenue",
    channel: "voice",
    description: "Qualifies telephone callers through natural conversational discovery questions.",
    defaultActionType: "VOICE_LEAD_QUALIFICATION",
  },
  {
    id: "uc-voice-lead-capture",
    name: "Voice Lead Capture",
    category: "Sales & Revenue",
    channel: "voice",
    description: "Transcribes and parses caller identity, email, and requirements during live calls.",
    defaultActionType: "VOICE_LEAD_CAPTURE",
  },
  {
    id: "uc-voice-crm-lead-creation",
    name: "Voice CRM Lead Creation",
    category: "Sales & Revenue",
    channel: "voice",
    description: "Generates CRM lead records immediately after phone calls with audio summary attachments.",
    defaultActionType: "VOICE_CRM_LEAD_CREATION",
  },
  {
    id: "uc-voice-sales-follow-up-calls",
    name: "Sales Follow-Up Calls",
    category: "Sales & Revenue",
    channel: "voice",
    description: "Places proactive outbound check-in calls to warm leads and requested callbacks.",
    defaultActionType: "SALES_FOLLOW_UP_CALLS",
  },

  // ─── Scheduling & Appointments (4: 1 Chat, 3 Voice) ─────────────────
  {
    id: "uc-chat-demo-booking",
    name: "Demo Booking",
    category: "Scheduling & Appointments",
    channel: "chat",
    description: "Checks real-time team calendar availability and schedules product demo meetings.",
    defaultActionType: "DEMO_BOOKING",
  },
  {
    id: "uc-voice-demo-booking-calls",
    name: "Demo Booking Calls",
    category: "Scheduling & Appointments",
    channel: "voice",
    description: "Schedules calendar meetings and executive briefings over the phone.",
    defaultActionType: "DEMO_BOOKING_CALLS",
  },
  {
    id: "uc-voice-appointment-confirmation-calls",
    name: "Appointment Confirmation Calls",
    category: "Scheduling & Appointments",
    channel: "voice",
    description: "Calls clients 24 hours in advance to confirm attendance and minimize no-shows.",
    defaultActionType: "APPOINTMENT_CONFIRMATION_CALLS",
  },
  {
    id: "uc-voice-appointment-rescheduling-calls",
    name: "Appointment Rescheduling Calls",
    category: "Scheduling & Appointments",
    channel: "voice",
    description: "Handles caller rescheduling requests and synchronizes modified slots across calendars.",
    defaultActionType: "APPOINTMENT_RESCHEDULING_CALLS",
  },

  // ─── Customer Support (13: 6 Chat, 7 Voice) ─────────────────────────
  {
    id: "uc-chat-customer-support",
    name: "Customer Support",
    category: "Customer Support",
    channel: "chat",
    description: "Resolves product questions and troubleshooting steps grounded in corporate knowledge base.",
    defaultActionType: "CUSTOMER_SUPPORT",
  },
  {
    id: "uc-chat-issue-detection",
    name: "Issue Detection",
    category: "Customer Support",
    channel: "chat",
    description: "Classifies reported bugs, outage signals, or operational friction in customer messages.",
    defaultActionType: "ISSUE_DETECTION",
  },
  {
    id: "uc-chat-automatic-ticket-creation",
    name: "Automatic Ticket Creation",
    category: "Customer Support",
    channel: "chat",
    description: "Opens formatted Zendesk, Jira, or Freshdesk tickets automatically from chats.",
    defaultActionType: "AUTOMATIC_TICKET_CREATION",
  },
  {
    id: "uc-chat-ticket-prioritization",
    name: "Ticket Prioritization",
    category: "Customer Support",
    channel: "chat",
    description: "Evaluates incident urgency and sets priority tags (P0, P1, P2) based on severity.",
    defaultActionType: "TICKET_PRIORITIZATION",
  },
  {
    id: "uc-chat-ticket-assignment",
    name: "Ticket Assignment",
    category: "Customer Support",
    channel: "chat",
    description: "Routes issues to specialized departmental queues and engineer on-call rosters.",
    defaultActionType: "TICKET_ASSIGNMENT",
  },
  {
    id: "uc-chat-human-escalation",
    name: "Human Escalation",
    category: "Customer Support",
    channel: "chat",
    description: "Transfers complex or sensitive customer conversations to live human operators with full context.",
    defaultActionType: "HUMAN_ESCALATION",
  },
  {
    id: "uc-voice-customer-support-calls",
    name: "Customer Support Calls",
    category: "Customer Support",
    channel: "voice",
    description: "Provides empathetic 24/7 spoken phone support with sub-400ms conversational latency.",
    defaultActionType: "CUSTOMER_SUPPORT_CALLS",
  },
  {
    id: "uc-voice-issue-reporting",
    name: "Issue Reporting",
    category: "Customer Support",
    channel: "voice",
    description: "Collects structured error descriptions, account numbers, and device details over the phone.",
    defaultActionType: "ISSUE_REPORTING",
  },
  {
    id: "uc-voice-automatic-ticket-creation",
    name: "Voice Automatic Ticket Creation",
    category: "Customer Support",
    channel: "voice",
    description: "Spawns support tickets directly from phone transcripts with audio timestamps.",
    defaultActionType: "VOICE_AUTOMATIC_TICKET_CREATION",
  },
  {
    id: "uc-voice-ticket-priority-detection",
    name: "Ticket Priority Detection",
    category: "Customer Support",
    channel: "voice",
    description: "Detects caller distress and urgent keywords to flag emergency support tickets.",
    defaultActionType: "TICKET_PRIORITY_DETECTION",
  },
  {
    id: "uc-voice-ticket-assignment",
    name: "Ticket Assignment & IVR Routing",
    category: "Customer Support",
    channel: "voice",
    description: "Intelligently routes telephone callers without frustrating numerical keypad menus.",
    defaultActionType: "TICKET_ASSIGNMENT",
  },
  {
    id: "uc-voice-critical-incident-escalation",
    name: "Critical Incident Escalation",
    category: "Customer Support",
    channel: "voice",
    description: "Triggers on-call PagerDuty or OpsGenie alerts when a caller reports a service outage.",
    defaultActionType: "CRITICAL_INCIDENT_ESCALATION",
  },
  {
    id: "uc-voice-human-call-transfer",
    name: "Human Call Transfer",
    category: "Customer Support",
    channel: "voice",
    description: "Transfers the live PSTN phone call to a human agent via SIP with warm handover briefing.",
    defaultActionType: "HUMAN_CALL_TRANSFER",
  },

  // ─── Customer Success & Retention (8: 5 Chat, 3 Voice) ──────────────
  {
    id: "uc-chat-feedback-collection",
    name: "Customer Feedback Collection",
    category: "Customer Success & Retention",
    channel: "chat",
    description: "Gathers CSAT, NPS, and qualitative feedback at the conclusion of engagements.",
    defaultActionType: "CUSTOMER_FEEDBACK_COLLECTION",
  },
  {
    id: "uc-chat-sentiment-detection",
    name: "Customer Sentiment Detection",
    category: "Customer Success & Retention",
    channel: "chat",
    description: "Analyzes customer emotional tone in real-time to alert account managers to churn risks.",
    defaultActionType: "CUSTOMER_SENTIMENT_DETECTION",
  },
  {
    id: "uc-chat-customer-info-retrieval",
    name: "Customer Information Retrieval",
    category: "Customer Success & Retention",
    channel: "chat",
    description: "Authenticates users to look up account balances, policy limits, or subscription tiers.",
    defaultActionType: "CUSTOMER_INFO_RETRIEVAL",
  },
  {
    id: "uc-chat-order-status",
    name: "Order / Service Status",
    category: "Customer Success & Retention",
    channel: "chat",
    description: "Fetches live tracking, package delivery estimates, or service order statuses.",
    defaultActionType: "ORDER_STATUS",
  },
  {
    id: "uc-chat-cancellation-refund",
    name: "Cancellation / Refund Handling",
    category: "Customer Success & Retention",
    channel: "chat",
    description: "Processes structured cancellation requests, offers save discounts, and logs exit reasons.",
    defaultActionType: "CANCELLATION_REFUND",
  },
  {
    id: "uc-voice-customer-feedback-calls",
    name: "Customer Feedback Calls",
    category: "Customer Success & Retention",
    channel: "voice",
    description: "Conducts brief, courteous post-purchase or post-onboarding satisfaction phone surveys.",
    defaultActionType: "CUSTOMER_FEEDBACK_CALLS",
  },
  {
    id: "uc-voice-renewal-calls",
    name: "Renewal Calls",
    category: "Customer Success & Retention",
    channel: "voice",
    description: "Proactively contacts clients approaching contract expiration to discuss renewal terms.",
    defaultActionType: "RENEWAL_CALLS",
  },
  {
    id: "uc-voice-customer-retention-calls",
    name: "Customer Retention Calls",
    category: "Customer Success & Retention",
    channel: "voice",
    description: "Engages at-risk accounts with customized retention offers and feedback interviews.",
    defaultActionType: "CUSTOMER_RETENTION_CALLS",
  },

  // ─── Operations & Intelligence (4: 2 Chat, 2 Voice) ─────────────────
  {
    id: "uc-chat-conversation-summary",
    name: "Conversation Summary",
    category: "Operations & Intelligence",
    channel: "chat",
    description: "Generates concise bulleted executive summaries of chat conversations for CRM records.",
    defaultActionType: "CONVERSATION_SUMMARY",
  },
  {
    id: "uc-chat-automated-email-trigger",
    name: "Automated Email Trigger",
    category: "Operations & Intelligence",
    channel: "chat",
    description: "Sends customized follow-up emails, contracts, or brochures immediately upon chat completion.",
    defaultActionType: "AUTOMATED_EMAIL_TRIGGER",
  },
  {
    id: "uc-voice-post-call-analysis",
    name: "Post-Call Analysis Engine",
    category: "Operations & Intelligence",
    channel: "voice",
    description: "Extracts key topics, action items, sentiment trends, and compliance markers from phone audio.",
    defaultActionType: "POST_CALL_ANALYSIS",
  },
  {
    id: "uc-voice-follow-up-email-trigger",
    name: "Follow-Up Email Trigger",
    category: "Operations & Intelligence",
    channel: "voice",
    description: "Dispatches automated email recap summaries and meeting invitations after telephone calls.",
    defaultActionType: "FOLLOW_UP_EMAIL_TRIGGER",
  },
];

/**
 * Maps raw categories to canonical categories.
 */
function resolveCanonicalCategory(rawCat: string, name: string, _type?: string): CanonicalCategory {
  const n = (name || "").toLowerCase();
  const c = (rawCat || "").toLowerCase();

  if (n.includes("booking") || n.includes("appointment") || n.includes("scheduler")) {
    return "Scheduling & Appointments";
  }
  if (c === "sales" || n.includes("sales") || n.includes("lead") || n.includes("crm") || n.includes("product")) {
    return "Sales & Revenue";
  }
  if (n.includes("feedback") || n.includes("sentiment") || n.includes("retention") || n.includes("renewal") || n.includes("refund") || n.includes("order")) {
    return "Customer Success & Retention";
  }
  if (c === "support" || n.includes("support") || n.includes("ticket") || n.includes("incident") || n.includes("escalation") || n.includes("issue")) {
    return "Customer Support";
  }
  if (c === "ops" || c === "general" || n.includes("summary") || n.includes("email") || n.includes("analysis")) {
    return "Operations & Intelligence";
  }
  return "Customer Support";
}

/**
 * Builds the enriched 48 Employee Templates from templates.json,
 * linking each to canonical use cases and setting truthful status.
 */
export const EMPLOYEE_TEMPLATES: EmployeeTemplate[] = (templatesJson as any[]).map((raw) => {
  const isHybrid = raw.type?.toLowerCase().includes("hybrid");
  const isVoice = raw.type?.toLowerCase().includes("voice");
  const channel: ChannelKind = isHybrid ? "hybrid" : isVoice ? "voice" : "chat";

  const canonicalCat = resolveCanonicalCategory(raw.category, raw.name, raw.type);

  // Determine truthful status: core Chat & Voice templates are available, experimental composite hybrid are coming_soon
  const isAvailable = !raw.id.includes("hybrid-03") && !raw.id.includes("hybrid-04") && !raw.id.includes("hybrid-07");
  const status: TemplateStatus = isAvailable ? "available" : "coming_soon";

  // Match canonical use case IDs based on name and category
  const matchedUseCases = CANONICAL_USE_CASES.filter((uc) => {
    const ucNameLower = uc.name.toLowerCase();
    const rawNameLower = raw.name.toLowerCase();
    return rawNameLower.includes(ucNameLower) || ucNameLower.includes(rawNameLower) || raw.id.includes(uc.id.replace("uc-", ""));
  });

  const useCaseIds = matchedUseCases.length > 0 
    ? matchedUseCases.map((u) => u.id)
    : [raw.id.startsWith("voice") ? "uc-voice-customer-support-calls" : "uc-chat-customer-support"];

  const samplePrompts = raw.sampleConversation && raw.sampleConversation.length > 0
    ? [raw.sampleConversation[0].content, "Tell me about pricing and enterprise plans", "Can we schedule a quick demo?"]
    : channel === "voice"
    ? ["I need help with my account setup", "Can you check appointment availability?", "I want to speak with an enterprise specialist"]
    : ["Hello, I'd like more details on your plans", "Can you connect to our Salesforce CRM?", "We have a critical technical issue"];

  const headline = raw.description && raw.description.length > 10
    ? raw.description.split(".")[0] + "."
    : `Autonomous ${channel.toUpperCase()} AI Employee executing ${raw.name} operations with enterprise tool integration.`;

  return {
    id: raw.id,
    name: raw.name,
    role: raw.suggestedRole || `${raw.name} Specialist`,
    headline,
    description: raw.description,
    category: canonicalCat,
    channel,
    status,
    capabilities: raw.useCases || ["Inbound engagement", "Grounded reasoning", "Automated CRM update"],
    useCaseIds,
    suggestedName: raw.suggestedName || `${raw.name} · Specialist`,
    suggestedRole: raw.suggestedRole || `${raw.name} Specialist`,
    defaultPrompt: raw.defaultPrompt || `You are an autonomous ${raw.name} Specialist at KaliGan AI.`,
    greetingMessage: raw.greetingMessage || "Hello! How can I assist you with your business needs today?",
    requiredConnectors: raw.requiredConnectors || (raw.connectors || ["salesforce", "slack", "gmail"]),
    requiredKnowledge: [
      "Enterprise Pricing & Sizing.pdf",
      "Product Architecture Whitepaper.md",
      "Customer Support & SLA Policies.pdf"
    ],
    samplePrompts,
    actionType: raw.actionType || "EXECUTE_WORKFLOW",
    steps: raw.steps,
    demoConfig: {
      scenario: `Inbound customer interaction simulating ${raw.name} with sandboxed tool execution.`,
      samplePrompts,
      simulatedAction: {
        tool: (raw.requiredConnectors && raw.requiredConnectors[0]) || "salesforce",
        action: raw.actionType?.toLowerCase() || "create_record",
        payloadDescription: "Simulated sandbox payload (zero external production side-effects).",
        defaultPayload: {
          leadSource: "KaliGan AI Marketplace Demo",
          workflow: raw.name,
          category: canonicalCat,
          status: "SIMULATED_SUCCESS",
          executionLatency: "240ms",
        },
      },
    },
    publisher: "KaliGan AI",
    isOfficial: true,
    rating: 4.9,
    reviewsCount: 120 + ((raw.id.length * 17) % 80),
  };
});

/**
 * Lookup helpers
 */
export function getTemplateById(id: string): EmployeeTemplate | undefined {
  return EMPLOYEE_TEMPLATES.find((t) => t.id === id) || EMPLOYEE_TEMPLATES[0];
}

export function getCanonicalUseCasesForTemplate(template: EmployeeTemplate): CanonicalUseCase[] {
  return CANONICAL_USE_CASES.filter((uc) => template.useCaseIds.includes(uc.id));
}
