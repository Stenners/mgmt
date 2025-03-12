export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface MeetingNote {
  id: string;
  organisationId: string;
  title: string;
  date: Date;
  attendees: string[];
  notes: string;
  actionItems: ActionItem[];
  aiSummary?: string;
  aiInsights?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
} 