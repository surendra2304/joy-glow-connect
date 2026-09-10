export interface MockTicket {
  id: string;
  agentId: string;
  agentName: string;
  subject: string;
  requesterName: string;
  requesterEmail: string;
  category: "Billing" | "Technical" | "Account" | "Feature Request";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sentiment: "Satisfied" | "Neutral" | "Frustrated" | "Angry";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";
  assignedTeam: string;
  createdAt: string;
  timeAgo: string;
  aiSummary: string;
  resolutionNote?: string;
}

export const MOCK_TICKETS: MockTicket[] = [
  {
    id: "TICK-44910",
    agentId: "agent-4",
    agentName: "Kavya · Tier-1 Voice Support Rep",
    subject: "Billing discrepancy on August enterprise invoice #INV-8891",
    requesterName: "Jonathan Hayes",
    requesterEmail: "finance@globaltech.com",
    category: "Billing",
    priority: "HIGH",
    sentiment: "Frustrated",
    status: "ESCALATED",
    assignedTeam: "Billing Operations",
    createdAt: "2026-09-01T21:05:12.000Z",
    timeAgo: "3 hours ago",
    aiSummary: "Caller charged for 15 unassigned seats on August invoice. Verified Stripe invoice line items and escalated to senior billing tier with $450 credit recommendation."
  },
  {
    id: "TICK-44911",
    agentId: "agent-4",
    agentName: "Kavya · Tier-1 Voice Support Rep",
    subject: "Webhook signature verification failing in EU region",
    requesterName: "Claire Dupont",
    requesterEmail: "c.dupont@eurocorp.fr",
    category: "Technical",
    priority: "MEDIUM",
    sentiment: "Neutral",
    status: "OPEN",
    assignedTeam: "Platform Engineering",
    createdAt: "2026-09-01T20:15:00.000Z",
    timeAgo: "4 hours ago",
    aiSummary: "Client webhook endpoint returning 401 signature mismatch. AI walked through HMAC-SHA256 header validation guide and opened ticket for API token refresh."
  },
  {
    id: "TICK-44912",
    agentId: "agent-6",
    agentName: "Tara · Omnichannel Support & Voice Continuity",
    subject: "Password reset and MFA sync issue",
    requesterName: "Brian Miller",
    requesterEmail: "bmiller@acmelogistics.com",
    category: "Account",
    priority: "LOW",
    sentiment: "Satisfied",
    status: "RESOLVED",
    assignedTeam: "Tier-1 Support",
    createdAt: "2026-09-01T18:30:00.000Z",
    timeAgo: "6 hours ago",
    aiSummary: "User locked out after MFA authenticator device reset. AI verified identity via email OTP and initiated secure password reset token.",
    resolutionNote: "Self-service recovery link dispatched and verified by user in chat."
  }
];
