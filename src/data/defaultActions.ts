import type { ConfiguredAction } from "../types/template";

export const DEFAULT_ACTIONS: ConfiguredAction[] = [
  {
    id: "act_email_01",
    name: "Send Welcome & Discovery Email",
    type: "email",
    provider: "gmail",
    enabled: true,
    triggerEvent: "When Lead is Captured",
    config: {
      recipient: "lead",
      subject: "Your KaliGan AI Consultation Summary — {{lead.name}}",
      bodyTemplate: "Hi {{lead.name}},\n\nThank you for exploring KaliGan AI for {{lead.company}}. Below is a summary of our discussion and the enterprise documentation you requested.\n\nKey Requirements:\n- Target Timeline: {{lead.timeline}}\n- Project Scope: {{lead.budget}}\n\nOur solutions specialist will follow up shortly to schedule your live walkthrough.\n\nBest regards,\n{{agent.name}}\nKaliGan AI Team",
    },
  },
  {
    id: "act_slack_02",
    name: "Post Hot Lead Notification to Slack",
    type: "slack",
    provider: "slack",
    enabled: true,
    triggerEvent: "When Lead Score > 75",
    config: {
      channel: "#sales-leads",
      bodyTemplate: "🔥 *New Hot Lead Captured by {{agent.name}}*\n*Name:* {{lead.name}} ({{lead.company}})\n*Email:* {{lead.email}} | *Phone:* {{lead.phone}}\n*Budget & Scope:* {{lead.budget}}\n*Timeline:* {{lead.timeline}}",
    },
  },
  {
    id: "act_crm_03",
    name: "Create Opportunity in HubSpot / Salesforce",
    type: "crm",
    provider: "hubspot",
    enabled: true,
    triggerEvent: "When Contact Info is Verified",
    config: {
      crmObject: "Deal & Contact",
      dealStage: "Discovery Scheduled",
      bodyTemplate: "Source: KaliGan AI Autonomous Inbound Agent · Lead Score: Hot",
    },
  },
];
