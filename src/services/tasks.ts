import { TodoTaskResponse, CreateTodoTaskRequest, UpdateTodoTaskRequest } from "@/types/task";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockTasks: TodoTaskResponse[] = [
  {
    id: "t1",
    isCompleted: false,
    title: "Подготовить презентацию"
  },
  {
    id: "t2",
    isCompleted: true,
    title: "Обсудить техническое задание"
  }
];

export async function mockCreateTask(data: CreateTodoTaskRequest): Promise<TodoTaskResponse> {
  await delay(150);
  return {
    id: String(Date.now()),
    isCompleted: false,
    title: data.title
  };
}

// ========== API функции ==========
async function apiCreateTask(data: CreateTodoTaskRequest): Promise<TodoTaskResponse> {
  return await apiClient.post<TodoTaskResponse>(API_ENDPOINTS.tasks.create, data);
}

async function apiUpdateTask(taskId: string, data: UpdateTodoTaskRequest): Promise<TodoTaskResponse> {
  return await apiClient.put<TodoTaskResponse>(API_ENDPOINTS.tasks.update(taskId), data);
}

async function apiDeleteTask(taskId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.tasks.delete(taskId));
}

async function apiCompleteTask(taskId: string): Promise<TodoTaskResponse> {
  return await apiClient.put<TodoTaskResponse>(API_ENDPOINTS.tasks.complete(taskId), {});
}

// ========== Публичные функции ==========
export async function createTask(data: CreateTodoTaskRequest): Promise<TodoTaskResponse> {
  return withApiFallback(
    () => apiCreateTask(data),
    () => mockCreateTask(data)
  );
}

export async function updateTask(taskId: string, data: UpdateTodoTaskRequest): Promise<TodoTaskResponse> {
  return withApiFallback(
    () => apiUpdateTask(taskId, data),
    async () => ({
      id: taskId,
      isCompleted: data.isCompleted || false,
      title: data.title || "Задача"
    })
  );
}

export async function deleteTask(taskId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteTask(taskId),
    async () => { console.log(`Удаление задачи ${taskId}`); }
  );
}

export async function completeTask(taskId: string): Promise<TodoTaskResponse> {
  return withApiFallback(
    () => apiCompleteTask(taskId),
    async () => ({
      id: taskId,
      isCompleted: true,
      title: "Завершенная задача"
    })
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}