export type MilestoneType = 'global' | 'local';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  type: MilestoneType;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId?: string; // для local милстоунов
  assignedTo?: string; // userId
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  progress: number; // 0-100
  dependencies?: string[]; // IDs других милстоунов
}

export interface MilestoneCreate {
  title: string;
  description?: string;
  type: MilestoneType;
  targetDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId?: string;
  assignedTo?: string;
  dependencies?: string[];
}