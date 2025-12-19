import { ApplicationBriefResponse, ApplicationResponse, ApplicationBriefListResponse, UpdateApplicationRequest, SendMessageRequest, MessageListResponse } from "@/types/application";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockApplications: ApplicationBriefResponse[] = [
  {
    id: "app1",
    caseId: "case1",
    caseTitle: "Разработка мобильного приложения",
    teamTitle: "Команда А",
    status: 1, // New
    updatedAt: "2024-01-15T10:00:00Z",
    unreadMessagesCount: 2
  },
  {
    id: "app2",
    caseId: "case2",
    caseTitle: "Создание веб-платформы",
    teamTitle: "Команда Б",
    status: 0, // InProgress
    updatedAt: "2024-01-14T15:30:00Z",
    unreadMessagesCount: 0
  }
];

export async function mockFetchApplications(): Promise<ApplicationBriefResponse[]> {
  await delay(200);
  return mockApplications;
}

export async function mockFetchApplication(id: string): Promise<ApplicationResponse> {
  await delay(150);
  return {
    completed: true,
    message: 'OK',
    id,
    caseId: "case1",
    caseTitle: "Разработка мобильного приложения",
    teamTitle: "Команда А",
    telegramUsername: "@team_a",
    status: 1, // New
    updatedAt: "2024-01-15T10:00:00Z",
    questionResponses: [],
    messages: []
  };
}

export async function mockUpdateApplication(id: string, data: UpdateApplicationRequest): Promise<ApplicationResponse> {
  await delay(150);
  const app = mockApplications.find(a => a.id === id);
  if (!app) throw new Error('Заявка не найдена');

  return {
    completed: true,
    message: 'Заявка обновлена',
    id: app.id,
    caseId: app.caseId,
    caseTitle: app.caseTitle,
    teamTitle: app.teamTitle,
    telegramUsername: "@team_example",
    status: data.status,
    updatedAt: new Date().toISOString(),
    questionResponses: [],
    messages: []
  };
}

// ========== API функции ==========
async function apiFetchApplications(): Promise<ApplicationBriefResponse[]> {
  const response = await apiClient.get<ApplicationBriefListResponse>(API_ENDPOINTS.applications.list);
  return response.applications;
}

async function apiFetchApplication(id: string): Promise<ApplicationResponse> {
  return await apiClient.get<ApplicationResponse>(API_ENDPOINTS.applications.detail(id));
}

async function apiUpdateApplication(id: string, data: UpdateApplicationRequest): Promise<ApplicationResponse> {
  return await apiClient.put<ApplicationResponse>(API_ENDPOINTS.applications.update(id), data);
}

async function apiSendMessage(applicationId: string, data: SendMessageRequest): Promise<MessageListResponse> {
  return await apiClient.post<MessageListResponse>(API_ENDPOINTS.applications.sendMessage(applicationId), data);
}

async function apiDeleteApplication(id: string): Promise<void> {
  await apiClient.delete<void>(API_ENDPOINTS.applications.delete(id));
}

// ========== Публичные функции ==========
export async function fetchApplications(): Promise<ApplicationBriefResponse[]> {
  return withApiFallback(
    () => apiFetchApplications(),
    () => mockFetchApplications()
  );
}

export async function fetchApplication(id: string): Promise<ApplicationResponse> {
  return withApiFallback(
    () => apiFetchApplication(id),
    () => mockFetchApplication(id)
  );
}

export async function updateApplication(id: string, data: UpdateApplicationRequest): Promise<ApplicationResponse> {
  return withApiFallback(
    () => apiUpdateApplication(id, data),
    () => mockUpdateApplication(id, data)
  );
}

export async function sendMessage(applicationId: string, data: SendMessageRequest): Promise<MessageListResponse> {
  return withApiFallback(
    () => apiSendMessage(applicationId, data),
    async () => ({
      messages: []
    })
  );
}

export async function deleteApplication(id: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteApplication(id),
    async () => { console.log(`Удаление заявки ${id}`); }
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}