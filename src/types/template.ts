export interface ActionParam {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "select";
  required?: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface ActionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  actionType: string;
  requiredConnectors?: string[];
  params?: ActionParam[];
}

export interface ConfiguredAction {
  id: string;
  name: string;
  type: string;
  provider: string;
  enabled: boolean;
  triggerEvent: string;
  config: Record<string, any>;
}

export interface LeadFieldConfig {
  id?: string;
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "email" | "phone" | "select" | "text";
  required?: boolean;
  enabled?: boolean;
  options?: string[];
  description?: string;
}

export type LeadFieldDef = LeadFieldConfig;

export interface CustomAction {
  id: string;
  name: string;
  actionType: string;
  enabled: boolean;
  config?: Record<string, any>;
}
