export interface ActionRun {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  timeAgo: string;
  tool: "salesforce" | "hubspot" | "zoho" | "gmail" | "slack" | "calendar" | "stripe" | "zendesk";
  toolName: string;
  actionType: string;
  status: "success" | "pending" | "failed";
  durationMs: number;
  triggerContext: string;
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
}

export const MOCK_ACTION_RUNS: ActionRun[] = [
  {
    id: "run_sf_90481",
    agentId: "agent-1",
    agentName: "Medha · Lead Capture Specialist",
    timestamp: "2026-09-02T00:15:32.000Z",
    timeAgo: "12 mins ago",
    tool: "salesforce",
    toolName: "Salesforce CRM",
    actionType: "create_lead",
    status: "success",
    durationMs: 280,
    triggerContext: "Visitor shared work email (alex@acme.com) and requested enterprise demo for 50 seats.",
    inputPayload: {
      FirstName: "Alex",
      LastName: "Rivera",
      Company: "Acme Enterprise",
      Email: "alex@acme.com",
      Phone: "+1 (415) 890-2190",
      LeadSource: "KaliGan AI Chat Agent",
      Status: "Qualified",
      Score__c: 94,
      Seats__c: 50,
      Notes__c: "Interested in sub-400ms voice agent with pgvector grounding and Salesforce bi-directional sync."
    },
    outputPayload: {
      success: true,
      id: "00Q5g00000abc12XYZ",
      status: "Created",
      assignedOwner: "Sarah Jenkins (Enterprise Sales Rep)",
      syncTimestamp: "2026-09-02T00:15:32.280Z"
    }
  },
  {
    id: "run_gm_89102",
    agentId: "agent-1",
    agentName: "Medha · Lead Capture Specialist",
    timestamp: "2026-09-02T00:15:33.000Z",
    timeAgo: "12 mins ago",
    tool: "gmail",
    toolName: "Gmail Dispatch",
    actionType: "send_confirmation_email",
    status: "success",
    durationMs: 190,
    triggerContext: "Triggered confirmation receipt and enterprise solution packet to verified lead.",
    inputPayload: {
      to: "alex@acme.com",
      subject: "Welcome to KaliGan AI — Enterprise Demo & Architecture Guide",
      template: "enterprise_lead_welcome",
      attachments: ["kaligan_architecture_whitepaper.pdf"]
    },
    outputPayload: {
      messageId: "<c8f92-910a-gmail@mail.kaligan.ai>",
      status: "DELIVERED",
      deliveredAt: "2026-09-02T00:15:33.190Z"
    }
  },
  {
    id: "run_sl_77219",
    agentId: "agent-1",
    agentName: "Medha · Lead Capture Specialist",
    timestamp: "2026-09-02T00:15:33.500Z",
    timeAgo: "12 mins ago",
    tool: "slack",
    toolName: "Slack Notifications",
    actionType: "post_channel_alert",
    status: "success",
    durationMs: 145,
    triggerContext: "Dispatched real-time Hot Lead alert to sales team channel.",
    inputPayload: {
      channel: "#sales-enterprise-leads",
      leadName: "Alex Rivera",
      company: "Acme Enterprise",
      score: "94 (Hot Lead)",
      dealSizeEstimate: "$36,000 ARR"
    },
    outputPayload: {
      ok: true,
      ts: "1725236133.500200",
      channel: "C08912KLM"
    }
  },
  {
    id: "run_zh_66102",
    agentId: "agent-2",
    agentName: "Aarav · Voice Inbound Sales Rep",
    timestamp: "2026-09-01T23:42:10.000Z",
    timeAgo: "45 mins ago",
    tool: "zoho",
    toolName: "Zoho CRM",
    actionType: "create_contact_and_deal",
    status: "success",
    durationMs: 340,
    triggerContext: "Verbal phone qualification extracted budget of $50k and decision maker authority.",
    inputPayload: {
      Contact_Name: "Priya Sharma",
      Account_Name: "FinTech Scale Corp",
      Email: "priya@fintechscale.io",
      Phone: "+1 (650) 420-9912",
      Deal_Stage: "Value Proposition",
      Expected_Revenue: 50000
    },
    outputPayload: {
      code: "SUCCESS",
      entityId: "ZH_99210481",
      dealId: "DL_881920"
    }
  },
  {
    id: "run_cal_55410",
    agentId: "agent-3",
    agentName: "Maya · ReceiptNest Clinic Scheduler",
    timestamp: "2026-09-01T22:18:40.000Z",
    timeAgo: "2 hours ago",
    tool: "calendar",
    toolName: "Google Calendar",
    actionType: "schedule_appointment",
    status: "success",
    durationMs: 210,
    triggerContext: "Patient called for Dr. Harrison cardiology consultation, verified availability and booked.",
    inputPayload: {
      organizationId: "clinic_metro_health_04",
      doctorName: "Dr. Eleanor Harrison",
      patientName: "David Miller",
      patientPhone: "+1 (206) 555-0144",
      slot: "2026-09-04T14:30:00-07:00",
      durationMinutes: 45
    },
    outputPayload: {
      eventId: "cal_evt_99812401",
      status: "CONFIRMED",
      confirmationCode: "RN-8942",
      calendarLink: "https://calendar.google.com/event?id=cal_evt_99812401"
    }
  },
  {
    id: "run_zen_44102",
    agentId: "agent-4",
    agentName: "Kavya · Tier-1 Voice Support Rep",
    timestamp: "2026-09-01T21:05:12.000Z",
    timeAgo: "3 hours ago",
    tool: "zendesk",
    toolName: "Zendesk Support",
    actionType: "create_support_ticket",
    status: "success",
    durationMs: 260,
    triggerContext: "Customer reported billing discrepancy in recent invoice; AI categorized as High Priority.",
    inputPayload: {
      ticketSubject: "Billing discrepancy on August enterprise invoice #INV-8891",
      requesterEmail: "finance@globaltech.com",
      priority: "HIGH",
      category: "Billing / Invoices",
      detectedSentiment: "Frustrated",
      aiSummary: "Customer was charged for 15 unassigned seats. Recommended credit adjustment of $450."
    },
    outputPayload: {
      ticketId: "TICK-44910",
      status: "OPEN",
      assignedGroup: "Billing Tier-2 Specialists",
      escalationTriggered: true
    }
  },
  {
    id: "run_str_33219",
    agentId: "agent-4",
    agentName: "Kavya · Tier-1 Voice Support Rep",
    timestamp: "2026-09-01T21:05:13.000Z",
    timeAgo: "3 hours ago",
    tool: "stripe",
    toolName: "Stripe Billing",
    actionType: "fetch_invoice_details",
    status: "success",
    durationMs: 180,
    triggerContext: "Verified live invoice charges on Stripe for customer query.",
    inputPayload: {
      customerId: "cus_N8912xKl901",
      invoiceId: "in_1Px982Kl9012"
    },
    outputPayload: {
      amountDue: 450000,
      currency: "usd",
      status: "paid",
      lineItemsCount: 3
    }
  },
  {
    id: "run_hub_22104",
    agentId: "agent-5",
    agentName: "Rohan · BANT Lead Qualification Specialist",
    timestamp: "2026-09-01T19:30:00.000Z",
    timeAgo: "5 hours ago",
    tool: "hubspot",
    toolName: "HubSpot CRM",
    actionType: "create_deal",
    status: "success",
    durationMs: 310,
    triggerContext: "Scored high-budget lead with immediate 30-day timeline requirement.",
    inputPayload: {
      dealname: "CloudScale Inc — 100 AI Voice Agents",
      pipeline: "default",
      dealstage: "appointmentscheduled",
      amount: "72000",
      closedate: "2026-09-30"
    },
    outputPayload: {
      dealId: "hs_deal_889120",
      status: "SYNCED"
    }
  }
];
