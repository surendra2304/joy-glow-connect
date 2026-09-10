import { z } from "zod";

export interface Agent {
  id: string;
  name: string;
  voiceName?: string;
  model?: string;
  [key: string]: any;
}

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  agentId?: string;
  status: string;
  agent?: { name: string };
}

export interface OutboundCallRequest {
  agentId: string;
  phone: string;
  fromNumber?: string;
  recipientName?: string;
  leadId?: string;
  customPrompt?: string;
}

export const OutboundCallResponseSchema = z.object({
  callSid: z.string(),
  status: z.string().optional(),
});
export type OutboundCallResponse = z.infer<typeof OutboundCallResponseSchema>;
