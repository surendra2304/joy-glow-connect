export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool' | 'visitor' | 'agent';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  workspaceId?: string;
  status?: string;
  lastMessageAt?: string;
  startedAt?: string;
  preview?: string;
  snippet?: string;
  score?: "Hot" | "Warm" | "Cold" | string | null;
  messageCount?: number;
  visitorLabel?: string;
  channel?: string;
  recordingUrl?: string;
  callMeta?: {
    durationSec?: number;
    latencyMs?: number;
  };
  lead?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    score?: string;
    intent?: string;
    aiNote?: string;
  } | null;
  messages?: Message[];
  createdAt: string;
  updatedAt?: string;
}

