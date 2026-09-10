export type AgentKind = 'chat' | 'voice';
export type AgentStatus = 'live' | 'testing' | 'paused' | 'draft';

export interface Agent {
  id: string;
  workspaceId: string;
  name: string;
  kind: AgentKind;
  status: AgentStatus;
  persona?: string;
  prompt?: string;
  modelId?: string;
  greeting?: string;
  voiceId?: string;
  language?: string;
  transferNumber?: string;
  leadCaptureEnabled?: boolean;
  captureFields?: string[];
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}
