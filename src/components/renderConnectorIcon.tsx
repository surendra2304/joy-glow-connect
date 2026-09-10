import { AppIcons } from "./IntegrationIcons";
import * as I from "./icons";

/**
 * Renders a connector/integration icon by id, with an optional fallback image URL.
 * Consolidated from Templates.tsx, TemplateFlow.tsx, and EmployeeTabs.tsx.
 */
export function renderConnectorIcon(id: string, fallbackUrl?: string, size = 5) {
  const IconComp = AppIcons[id as keyof typeof AppIcons];
  if (IconComp) {
    return <IconComp className={`w-${size} h-${size} shrink-0`} />;
  }
  if (fallbackUrl) {
    return <img src={fallbackUrl} alt={id} className={`w-${size} h-${size} object-contain shrink-0`} />;
  }
  return <I.Plug width={size * 4} height={size * 4} className="text-[var(--g-muted-foreground)] shrink-0" />;
}
