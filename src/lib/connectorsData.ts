export type ConnectorStatus = "not-connected" | "connected" | "needs-reauth";
export type ConnectorCategory = "All" | "Communication" | "CRM" | "Productivity";

export type ConnectorRecord = {
  id: string;
  name: string;
  description: string;
  status: ConnectorStatus;
  iconName: string;
  category: Exclude<ConnectorCategory, "All">;
  logoUrl: string;
};

export const initialConnectors: ConnectorRecord[] = [
  { id: "notion", name: "Notion", description: "Create and search pages", status: "not-connected", iconName: "N", category: "Productivity", logoUrl: "https://cdn.worldvectorlogo.com/logos/notion-2.svg" },
  { id: "slack", name: "Slack", description: "Send messages, read channels", status: "not-connected", iconName: "S", category: "Communication", logoUrl: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" },
  { id: "drive", name: "Google Drive", description: "Find and read files", status: "not-connected", iconName: "G", category: "Productivity", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" },
  { id: "gmail", name: "Gmail", description: "Read and send email", status: "not-connected", iconName: "M", category: "Communication", logoUrl: "https://cdn.worldvectorlogo.com/logos/gmail-icon.svg" },
  { id: "hubspot", name: "HubSpot", description: "Update contacts and deals", status: "not-connected", iconName: "H", category: "CRM", logoUrl: "https://cdn.worldvectorlogo.com/logos/hubspot.svg" },
  { id: "zoho", name: "Zoho CRM", description: "Create and manage leads", status: "not-connected", iconName: "Z", category: "CRM", logoUrl: "https://cdn.worldvectorlogo.com/logos/zoho-1.svg" },
  { id: "salesforce", name: "Salesforce", description: "Sync accounts and opportunities", status: "not-connected", iconName: "SF", category: "CRM", logoUrl: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg" },
  { id: "stripe", name: "Stripe", description: "Check payments and charges", status: "not-connected", iconName: "$", category: "Productivity", logoUrl: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg" },
  { id: "vobiz", name: "Vobiz", description: "Make and receive AI phone calls", status: "not-connected", iconName: "V", category: "Communication", logoUrl: "https://www.vobiz.ai/logo.svg" },
];
