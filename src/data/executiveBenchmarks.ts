export interface TimeRangeOption {
  id: string;
  label: string;
  days: number;
}

export const EXECUTIVE_TIME_RANGES: TimeRangeOption[] = [
  { id: "24h", label: "24 Hours", days: 1 },
  { id: "7d", label: "7 Days", days: 7 },
  { id: "30d", label: "30 Days", days: 30 },
  { id: "90d", label: "90 Days", days: 90 },
];

export const ECONOMIC_BENCHMARKS = {
  humanHourlyLaborCost: 24, // $24/hr human customer service / SDR labor benchmark
  aiCostPerInteraction: 0.42, // $0.42 avg AI compute & voice turn cost
  humanHandlingTimeMinutes: 12, // 12 minutes avg human resolution time
  targetVoiceLatencyMs: 385, // Sub-400ms SLA threshold
};

export interface ExecutiveFunctionMetric {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  roiContribution: string;
  containmentRate: number;
  activeConnectors: string[];
}

export const FUNCTIONAL_BUSINESS_METRICS: Record<string, ExecutiveFunctionMetric[]> = {
  "7d": [
    {
      id: "maya-sales",
      name: "Maya",
      role: "Senior Inbound Sales Specialist",
      avatar: "🚀",
      department: "Sales & Pipeline",
      primaryMetricLabel: "Qualified Pipeline",
      primaryMetricValue: "$248,500",
      secondaryMetricLabel: "CRM Leads Created",
      secondaryMetricValue: "184 leads",
      roiContribution: "$32,100 labor & pipeline value",
      containmentRate: 91.2,
      activeConnectors: ["salesforce", "hubspot", "calendar"],
    },
    {
      id: "vedant-support",
      name: "Vedant",
      role: "Autonomous Tier 1 Support Specialist",
      avatar: "🎧",
      department: "Technical Support",
      primaryMetricLabel: "Tickets Resolved",
      primaryMetricValue: "412 tickets",
      secondaryMetricLabel: "Avg Resolution Time",
      secondaryMetricValue: "1m 45s",
      roiContribution: "$11,850 support labor saved",
      containmentRate: 86.8,
      activeConnectors: ["zendesk", "slack", "gmail"],
    },
    {
      id: "vani-voice",
      name: "Vani",
      role: "Telephony Voice Representative",
      avatar: "📞",
      department: "Voice Operations",
      primaryMetricLabel: "Appointments Booked",
      primaryMetricValue: "128 demos",
      secondaryMetricLabel: "Sub-400ms SLA Adherence",
      secondaryMetricValue: "99.4%",
      roiContribution: "$4,300 receptionist deflection",
      containmentRate: 89.1,
      activeConnectors: ["calendar", "twilio", "salesforce"],
    },
  ],
  "30d": [
    {
      id: "maya-sales",
      name: "Maya",
      role: "Senior Inbound Sales Specialist",
      avatar: "🚀",
      department: "Sales & Pipeline",
      primaryMetricLabel: "Qualified Pipeline",
      primaryMetricValue: "$1,120,000",
      secondaryMetricLabel: "CRM Leads Created",
      secondaryMetricValue: "792 leads",
      roiContribution: "$142,000 labor & pipeline value",
      containmentRate: 92.4,
      activeConnectors: ["salesforce", "hubspot", "calendar"],
    },
    {
      id: "vedant-support",
      name: "Vedant",
      role: "Autonomous Tier 1 Support Specialist",
      avatar: "🎧",
      department: "Technical Support",
      primaryMetricLabel: "Tickets Resolved",
      primaryMetricValue: "1,840 tickets",
      secondaryMetricLabel: "Avg Resolution Time",
      secondaryMetricValue: "1m 38s",
      roiContribution: "$52,600 support labor saved",
      containmentRate: 88.2,
      activeConnectors: ["zendesk", "slack", "gmail"],
    },
    {
      id: "vani-voice",
      name: "Vani",
      role: "Telephony Voice Representative",
      avatar: "📞",
      department: "Voice Operations",
      primaryMetricLabel: "Appointments Booked",
      primaryMetricValue: "542 demos",
      secondaryMetricLabel: "Sub-400ms SLA Adherence",
      secondaryMetricValue: "99.3%",
      roiContribution: "$19,400 receptionist deflection",
      containmentRate: 89.7,
      activeConnectors: ["calendar", "twilio", "salesforce"],
    },
  ],
};

export interface CostCurvePoint {
  label: string;
  humanCost: number;
  aiCost: number;
  netSavings: number;
}

export const ROI_COST_CURVE_DATA: Record<string, CostCurvePoint[]> = {
  "7d": [
    { label: "Mon", humanCost: 6400, aiCost: 280, netSavings: 6120 },
    { label: "Tue", humanCost: 7800, aiCost: 340, netSavings: 7460 },
    { label: "Wed", humanCost: 9200, aiCost: 410, netSavings: 8790 },
    { label: "Thu", humanCost: 8600, aiCost: 380, netSavings: 8220 },
    { label: "Fri", humanCost: 9800, aiCost: 430, netSavings: 9370 },
    { label: "Sat", humanCost: 3800, aiCost: 170, netSavings: 3630 },
    { label: "Sun", humanCost: 4900, aiCost: 210, netSavings: 4690 },
  ],
  "30d": [
    { label: "Week 1", humanCost: 42000, aiCost: 1850, netSavings: 40150 },
    { label: "Week 2", humanCost: 48500, aiCost: 2100, netSavings: 46400 },
    { label: "Week 3", humanCost: 51200, aiCost: 2280, netSavings: 48920 },
    { label: "Week 4", humanCost: 56000, aiCost: 2450, netSavings: 53550 },
  ],
};

export interface ConnectorHealthAudit {
  name: string;
  category: string;
  uptime: string;
  avgLatency: string;
  status: "operational" | "degraded" | "standby";
  lastSync: string;
}

export const ENTERPRISE_CONNECTOR_AUDIT: ConnectorHealthAudit[] = [
  {
    name: "Salesforce CRM",
    category: "CRM & Pipeline Sync",
    uptime: "99.98%",
    avgLatency: "118ms",
    status: "operational",
    lastSync: "2 mins ago",
  },
  {
    name: "Zendesk Helpdesk",
    category: "Customer Support Ticketing",
    uptime: "100.0%",
    avgLatency: "94ms",
    status: "operational",
    lastSync: "Just now",
  },
  {
    name: "Google Calendar",
    category: "Executive Demo Scheduling",
    uptime: "99.95%",
    avgLatency: "142ms",
    status: "operational",
    lastSync: "4 mins ago",
  },
  {
    name: "Stripe Billing",
    category: "Payment & Retention Audit",
    uptime: "100.0%",
    avgLatency: "86ms",
    status: "operational",
    lastSync: "1 min ago",
  },
  {
    name: "Twilio Telephony SIP",
    category: "Sub-400ms Voice Pipeline",
    uptime: "99.92%",
    avgLatency: "210ms",
    status: "operational",
    lastSync: "Just now",
  },
];
