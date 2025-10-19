export type TaskStatus = "todo" | "in_progress" | "done" | "archived";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string; // член команды
  projectId: string; // привязка к команде/проекту
  createdAt: string;
  updatedAt?: string;
}


