export interface TimelinePoint {
  date: string;
  value: number;
}

export interface AnalyticsSummary {
  chatMessages: number;
  chatMessagesDelta: string;
  voiceMinutes: number;
  voiceMinutesDelta: string;
  leadsCaptured: number;
  leadsCapturedDelta: string;
  conversionRate: string;
  conversionRateDelta: string;
  timeline: TimelinePoint[];
}
