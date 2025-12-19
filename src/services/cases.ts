import { ProjectCaseBriefResponse, ProjectCaseFullResponse, ProjectCaseListResponse, UpdateCaseRequest, CaseVoteRequest } from "@/types/case";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockCases: ProjectCaseBriefResponse[] = [
  {
    id: "case1",
    title: "Разработка мобильного приложения для банка",
    tutorId: "tutor1",
    tutorFio: "Иванова А.И.",
    maxTeams: 5,
    acceptedTeams: 3,
    isActive: true,
    updatedAt: "2024-01-15T10:00:00Z",
    votes: {
      0: [], // Neutral
      1: [], // Positive
      2: []  // Negative
    }
  },
  {
    id: "case2",
    title: "Создание веб-платформы для аналитики",
    tutorId: "tutor2",
    tutorFio: "Петров С.В.",
    maxTeams: 3,
    acceptedTeams: 2,
    isActive: true,
    updatedAt: "2024-01-14T15:30:00Z",
    votes: {
      0: [],
      1: [],
      2: []
    }
  }
];

export async function mockFetchCases(): Promise<ProjectCaseBriefResponse[]> {
  await delay(200);
  return mockCases;
}

export async function mockFetchCaseBrief(id: string): Promise<ProjectCaseBriefResponse> {
  await delay(150);
  const caseItem = mockCases.find(c => c.id === id);
  if (!caseItem) throw new Error('Кейс не найден');
  return caseItem;
}

export async function mockFetchCase(id: string): Promise<ProjectCaseFullResponse> {
  await delay(150);
  const caseItem = mockCases.find(c => c.id === id);
  if (!caseItem) throw new Error('Кейс не найден');

  return {
    completed: true,
    message: 'OK',
    id: caseItem.id,
    title: caseItem.title,
    description: "Описание кейса проекта",
    goal: "Цель проекта",
    requestedResult: "Ожидаемый результат",
    criteria: "Критерии оценки",
    tutorId: caseItem.tutorId,
    tutorFio: caseItem.tutorFio,
    maxTeams: caseItem.maxTeams,
    acceptedTeams: caseItem.acceptedTeams,
    isActive: caseItem.isActive,
    updatedAt: caseItem.updatedAt
  };
}

export async function mockUpdateCase(id: string, data: UpdateCaseRequest): Promise<ProjectCaseFullResponse> {
  await delay(150);
  const caseItem = mockCases.find(c => c.id === id);
  if (!caseItem) throw new Error('Кейс не найден');

  return {
    completed: true,
    message: 'Кейс обновлен',
    id: caseItem.id,
    title: data.title,
    description: data.description,
    goal: data.goal,
    requestedResult: data.requestedResult,
    criteria: data.criteria,
    tutorId: data.tutorId,
    tutorFio: caseItem.tutorFio,
    maxTeams: data.maxTeams,
    acceptedTeams: caseItem.acceptedTeams,
    isActive: data.isActive,
    updatedAt: new Date().toISOString()
  };
}

export async function mockVoteCase(caseId: string, data: CaseVoteRequest): Promise<void> {
  await delay(100);
  // Добавляем голос в mock данные
  const caseItem = mockCases.find(c => c.id === caseId);
  if (caseItem) {
    // Симулируем добавление голоса
    console.log(`Голос за кейс ${caseId}: ${data.reactionType}`);
  }
}

// ========== API функции ==========
async function apiFetchCases(): Promise<ProjectCaseBriefResponse[]> {
  const response = await apiClient.get<ProjectCaseListResponse>(API_ENDPOINTS.cases.list);
  return response.cases;
}

async function apiFetchCaseBrief(id: string): Promise<ProjectCaseBriefResponse> {
  return await apiClient.get<ProjectCaseBriefResponse>(API_ENDPOINTS.cases.brief(id));
}

async function apiFetchCase(id: string): Promise<ProjectCaseFullResponse> {
  return await apiClient.get<ProjectCaseFullResponse>(API_ENDPOINTS.cases.detail(id));
}

async function apiUpdateCase(id: string, data: UpdateCaseRequest): Promise<ProjectCaseFullResponse> {
  return await apiClient.put<ProjectCaseFullResponse>(API_ENDPOINTS.cases.update(id), data);
}

async function apiVoteCase(caseId: string, data: CaseVoteRequest): Promise<void> {
  await apiClient.post<void>(API_ENDPOINTS.cases.vote(caseId), data);
}

async function apiUnvoteCase(caseId: string): Promise<void> {
  await apiClient.post<void>(API_ENDPOINTS.cases.unvote(caseId));
}

async function apiCreateCase(data: UpdateCaseRequest): Promise<ProjectCaseFullResponse> {
  return await apiClient.post<ProjectCaseFullResponse>(API_ENDPOINTS.cases.create, data);
}

async function apiDeleteCase(id: string): Promise<void> {
  await apiClient.delete<void>(API_ENDPOINTS.cases.delete(id));
}

// ========== Публичные функции ==========
export async function fetchCases(): Promise<ProjectCaseBriefResponse[]> {
  return withApiFallback(
    () => apiFetchCases(),
    () => mockFetchCases()
  );
}

export async function fetchCaseBrief(id: string): Promise<ProjectCaseBriefResponse> {
  return withApiFallback(
    () => apiFetchCaseBrief(id),
    () => mockFetchCaseBrief(id)
  );
}

export async function fetchCase(id: string): Promise<ProjectCaseFullResponse> {
  return withApiFallback(
    () => apiFetchCase(id),
    () => mockFetchCase(id)
  );
}

export async function updateCase(id: string, data: UpdateCaseRequest): Promise<ProjectCaseFullResponse> {
  return withApiFallback(
    () => apiUpdateCase(id, data),
    () => mockUpdateCase(id, data)
  );
}

export async function voteCase(caseId: string, data: CaseVoteRequest): Promise<void> {
  return withApiFallback(
    () => apiVoteCase(caseId, data),
    () => mockVoteCase(caseId, data)
  );
}

export async function unvoteCase(caseId: string): Promise<void> {
  return withApiFallback(
    () => apiUnvoteCase(caseId),
    async () => { console.log(`Отмена голоса за кейс ${caseId}`); }
  );
}

export async function createCase(data: UpdateCaseRequest): Promise<ProjectCaseFullResponse> {
  return withApiFallback(
    () => apiCreateCase(data),
    () => mockUpdateCase('new', data)
  );
}

export async function deleteCase(id: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteCase(id),
    async () => { console.log(`Удаление кейса ${id}`); }
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}