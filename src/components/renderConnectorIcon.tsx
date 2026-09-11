import * as I from "./icons";
import calendarLogo from "../assets/logos/calendar.png.asset.json";
import notionLogo from "../assets/logos/notion.png.asset.json";
import zendeskLogo from "../assets/logos/zendesk.png.asset.json";
import jiraLogo from "../assets/logos/jira.png.asset.json";
import gmailLogo from "../assets/logos/gmail.png.asset.json";
import slackLogo from "../assets/logos/slack.png.asset.json";
import hubspotLogo from "../assets/logos/hubspot.png.asset.json";
import salesforceLogo from "../assets/logos/salesforce.png.asset.json";

const LOGOS: Record<string, string> = {
  calendar: calendarLogo.url,
  notion: notionLogo.url,
  zendesk: zendeskLogo.url,
  jira: jiraLogo.url,
  gmail: gmailLogo.url,
  slack: slackLogo.url,
  hubspot: hubspotLogo.url,
  salesforce: salesforceLogo.url,
};

/**
 * Renders a connector/integration icon by id, with an optional fallback image URL.
 */
export function renderConnectorIcon(id: string, fallbackUrl?: string, size = 5) {
  const url = LOGOS[id] ?? fallbackUrl;
  if (url) {
    return <img src={url} alt={id} className={`w-${size} h-${size} object-contain shrink-0`} />;
  }
  return <I.Plug width={size * 4} height={size * 4} className="text-[var(--g-muted-foreground)] shrink-0" />;
}
