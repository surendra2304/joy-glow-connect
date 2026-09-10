export type LeadScore = 'Hot' | 'Warm' | 'Cold';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  agentId?: string;
  workspaceId: string;
  name?: string;
  email?: string;
  phone?: string;
  score?: LeadScore;
  status?: LeadStatus;
  company?: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}
