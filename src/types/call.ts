import type { Message } from "./conversation";

export type CallDirection = 'inbound' | 'outbound';

export interface Call {
  id: string;
  agentId: string;
  workspaceId?: string;
  toNumber?: string;
  fromNumber?: string;
  direction?: CallDirection;
  status?: string;
  durationSeconds?: number;
  durationSec?: number;
  latencyMs?: number;
  recordingUrl?: string;
  conversation?: {
    messages?: Message[];
  };
  createdAt: string;
}

export interface CallConversation {
  id: string;
  captured: boolean;
  score?: "Hot" | "Warm" | "Cold";
  messages: {
    id: string;
    role: "visitor" | "agent";
    content: string;
    createdAt: string;
  }[];
  lead?: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    score: string;
    status: string;
    intent?: string;
    aiNote?: string;
  } | null;
}

export interface CallItem {
  id: string;
  callSid: string;
  fromNumber: string;
  direction: string;
  status: string;
  durationSec: number;
  recordingUrl?: string;
  latencyMs?: number;
  interruptions: number;
  outcome?: string;
  score?: "Hot" | "Warm" | "Cold" | null;
  captured?: boolean;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  agent?: { name?: string };
  fromNumber: string;
  status: string;
  customPrompt?: string;
  completedLeads: number;
  totalLeads: number;
  successfulLeads: number;
  createdAt: string;
  updatedAt?: string;
}
