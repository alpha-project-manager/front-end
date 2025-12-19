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

// Server task types
export interface CreateTodoTaskRequest {
  title: string;
  meetingId: string; // Guid as string
}

export interface UpdateTodoTaskRequest {
  title: string;
  isCompleted: boolean;
}

export interface TodoTaskResponse {
  id: string; // Guid as string
  isCompleted: boolean;
  title: string;
}