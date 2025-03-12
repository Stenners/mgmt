export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  organisationId: string;
  order: number;
  dueDate?: Date;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
} 