export interface MockCallRecord {
  id: string;
  agentId: string;
  agentName: string;
  callerNumber: string;
  callerName?: string;
  durationSeconds: number;
  durationFormatted: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  sentimentScore: number;
  timestamp: string;
  timeAgo: string;
  audioUrl?: string;
  transcript: Array<{ speaker: "Agent" | "Caller"; text: string; time: string }>;
  actionExecuted?: string;
}

export const MOCK_CALLS: MockCallRecord[] = [
  {
    id: "call-99120",
    agentId: "agent-2",
    agentName: "Aarav · Voice Inbound Sales Rep",
    callerNumber: "+1 (650) 420-9912",
    callerName: "Priya Sharma (FinTech Scale Corp)",
    durationSeconds: 142,
    durationFormatted: "2m 22s",
    sentiment: "Positive",
    sentimentScore: 0.94,
    timestamp: "2026-09-01T23:42:10.000Z",
    timeAgo: "55 mins ago",
    transcript: [
      { speaker: "Agent", text: "Thanks for calling KaliGan AI! My name is Aarav. How can I assist your team today?", time: "00:02" },
      { speaker: "Caller", text: "Hi Aarav, we are evaluating AI voice agents for our 120-person outbound sales desk.", time: "00:08" },
      { speaker: "Agent", text: "That is fantastic! KaliGan AI provides sub-400ms voice agents with native telephony bridging and bi-directional CRM sync for Salesforce and Zoho.", time: "00:18" },
      { speaker: "Caller", text: "Can we connect it to our Zoho CRM deals pipeline immediately?", time: "00:26" },
      { speaker: "Agent", text: "Yes, absolutely. I can create a new opportunity in your Zoho CRM right now and have our VP of Sales follow up with custom pricing. What is your preferred email?", time: "00:34" },
      { speaker: "Caller", text: "priya@fintechscale.io", time: "00:42" },
      { speaker: "Agent", text: "Thank you Priya! I have created the deal in Zoho CRM and dispatched your confirmation packet to priya@fintechscale.io.", time: "00:52" }
    ],
    actionExecuted: "Created Deal in Zoho CRM (ID: ZH_99210481)"
  },
  {
    id: "call-99121",
    agentId: "agent-3",
    agentName: "Maya · ReceiptNest Clinic Scheduler",
    callerNumber: "+1 (206) 555-0144",
    callerName: "David Miller",
    durationSeconds: 98,
    durationFormatted: "1m 38s",
    sentiment: "Positive",
    sentimentScore: 0.96,
    timestamp: "2026-09-01T22:18:40.000Z",
    timeAgo: "2 hours ago",
    transcript: [
      { speaker: "Agent", text: "Hello, this is Maya with ReceiptNest Medical Care. Are you calling to book, reschedule, or check an appointment today?", time: "00:02" },
      { speaker: "Caller", text: "Hi, I need to see Dr. Harrison at the Metro Health Cardiology Clinic this Thursday afternoon.", time: "00:10" },
      { speaker: "Agent", text: "Certainly! Dr. Harrison has an open slot this Thursday at 2:30 PM. May I have your full name and phone number to confirm this booking?", time: "00:20" },
      { speaker: "Caller", text: "My name is David Miller, phone is 206-555-0144.", time: "00:30" },
      { speaker: "Agent", text: "Thank you David. I have confirmed your appointment with Dr. Harrison for Thursday, Sep 4 at 2:30 PM. Your confirmation code is RN-8942.", time: "00:42" }
    ],
    actionExecuted: "Booked Appointment RN-8942 on Google Calendar"
  },
  {
    id: "call-99122",
    agentId: "agent-4",
    agentName: "Kavya · Tier-1 Voice Support Rep",
    callerNumber: "+1 (212) 555-0199",
    callerName: "Jonathan Hayes (GlobalTech)",
    durationSeconds: 185,
    durationFormatted: "3m 05s",
    sentiment: "Neutral",
    sentimentScore: 0.65,
    timestamp: "2026-09-01T21:05:12.000Z",
    timeAgo: "3 hours ago",
    transcript: [
      { speaker: "Agent", text: "Thank you for calling KaliGan Support. My name is Kavya. How can I help you today?", time: "00:02" },
      { speaker: "Caller", text: "I noticed a discrepancy on our August invoice #INV-8891 where we were charged for unassigned seats.", time: "00:12" },
      { speaker: "Agent", text: "I understand that frustration Jonathan. Let me check your Stripe invoice details right now.", time: "00:22" },
      { speaker: "Agent", text: "I have reviewed the invoice and opened high-priority support ticket #TICK-44910 with our Billing Team recommending a $450 credit.", time: "00:45" },
      { speaker: "Caller", text: "Thank you Kavya, that was very fast.", time: "00:54" }
    ],
    actionExecuted: "Created Zendesk Support Ticket #TICK-44910 & Stripe Verified"
  }
];
