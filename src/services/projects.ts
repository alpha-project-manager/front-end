import { mockProjects } from "@/data/mockProjects";
import { Project, ProjectBriefResponse, ProjectFullResponse, ProjectBriefListResponse, CreateNewProjectRequest, UpdateProjectRequest, ImportProjectsFromTeamProRequest, ImportProjectsResponse, GetProjectListResponse } from "@/types/project";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback, shouldUseMockData } from "@/lib/api-utils";

// Базовый URL для нашего API (замените на реальный адрес)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ========== Mock функции ==========
export async function mockFetchProjects(): Promise<ProjectBriefResponse[]> {
  await delay(200);
  // Преобразуем mockProjects в ProjectBriefResponse
  return mockProjects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    teamTitle: project.team?.[0]?.name || 'Команда',
    meetingUrl: 'https://meet.google.com/abc',
    status: 1, // InWork как пример
    semester: 1, // Spring как пример
    academicYear: 2024,
    tutor: {
      id: 'tutor1',
      firstName: 'Иван',
      lastName: 'Петров',
      fullName: 'Иван Петров'
    }
  }));
}

export async function mockCreateProject(data: CreateNewProjectRequest): Promise<ProjectBriefResponse> {
  await delay(150);
  return {
    id: String(Date.now()),
    title: data.title,
    teamTitle: data.teamTitle,
    status: 0, // Created
    semester: 1, // Spring
    academicYear: 2024,
    tutor: undefined
  };
}

export async function mockImportProjects(data: ImportProjectsFromTeamProRequest): Promise<ImportProjectsResponse> {
  await delay(300);
  return {
    completed: true,
    message: 'Проекты успешно импортированы',
    createdProjects: [],
    updatedProjects: []
  };
}

// ========== API функции ==========
async function apiFetchProjects(): Promise<ProjectBriefResponse[]> {
  const response = await apiClient.get<ProjectBriefListResponse>(API_ENDPOINTS.projects.list);
  return response.projects;
}

async function apiCreateProject(data: CreateNewProjectRequest): Promise<ProjectBriefResponse> {
  return await apiClient.post<ProjectBriefResponse>(API_ENDPOINTS.projects.create, data);
}

async function apiUpdateProject(id: string, data: UpdateProjectRequest): Promise<ProjectBriefResponse> {
  return await apiClient.put<ProjectBriefResponse>(API_ENDPOINTS.projects.update(id), data);
}

async function apiFetchProject(id: string): Promise<ProjectBriefResponse> {
  return await apiClient.get<ProjectBriefResponse>(API_ENDPOINTS.projects.detail(id));
}

async function apiImportProjects(data: ImportProjectsFromTeamProRequest): Promise<ImportProjectsResponse> {
  return await apiClient.post<ImportProjectsResponse>(API_ENDPOINTS.projects.import, data);
}

async function apiFetchProjectList(): Promise<GetProjectListResponse> {
  return await apiClient.get<GetProjectListResponse>(API_ENDPOINTS.test.getAllProjects);
}

async function apiDeleteProject(id: string): Promise<void> {
  await apiClient.delete<void>(API_ENDPOINTS.projects.delete(id));
}

async function apiAddStudentToProject(projectId: string, studentId: string): Promise<void> {
  await apiClient.post<void>(API_ENDPOINTS.projects.addStudent(projectId, studentId));
}

async function apiRemoveStudentFromProject(projectId: string, studentId: string): Promise<void> {
  await apiClient.delete<void>(API_ENDPOINTS.projects.removeStudent(projectId, studentId));
}

// ========== Legacy functions (для обратной совместимости) ==========
export async function fetchProjects(): Promise<Project[]> {
  await delay(200);
  return mockProjects;
}

export async function fetchProjectsByUniversity(university: string): Promise<Project[]> {
  await delay(200);
  return mockProjects.filter((p) => (p.curator?.includes(university) || false));
}

export async function fetchProjectsByCurator(curator: string): Promise<Project[]> {
  await delay(200);
  return mockProjects.filter((p) => (p.curator?.toLowerCase().includes(curator.toLowerCase()) || false));
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  await delay(150);
  const created: Project = { ...data, id: String(Date.now()) };
  mockProjects.push(created);
  return created;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  await delay(150);
  const idx = mockProjects.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Проект не найден");
  mockProjects[idx] = { ...mockProjects[idx], ...data };
  return mockProjects[idx];
}

export async function archiveProject(id: string): Promise<Project> {
  await delay(100);
  const project = await updateProject(id, {});
  return project;
}

// ========== Публичные функции (с автоматическим выбором моков/API) ==========
export async function fetchProjectsNew(): Promise<ProjectBriefResponse[]> {
  return withApiFallback(
    () => apiFetchProjects(),
    () => mockFetchProjects()
  );
}

export async function fetchProjectNew(id: string): Promise<ProjectBriefResponse> {
  if (shouldUseMockData()) {
    // Для моков возвращаем базовую структуру
    await delay(200);
    return {
      id,
      title: 'Тестовый проект',
      description: 'Описание тестового проекта',
      teamTitle: 'Команда',
      meetingUrl: 'https://meet.google.com/abc',
      status: 1, // InWork
      semester: 1, // Spring
      academicYear: 2024,
      tutor: {
        id: 'tutor1',
        firstName: 'Иван',
        lastName: 'Петров',
        fullName: 'Иван Петров'
      }
    };
  }
  return apiFetchProject(id);
}

export async function createProjectNew(data: CreateNewProjectRequest): Promise<ProjectBriefResponse> {
  return withApiFallback(
    () => apiCreateProject(data),
    () => mockCreateProject(data)
  );
}

export async function updateProjectNew(id: string, data: UpdateProjectRequest): Promise<ProjectBriefResponse> {
  return withApiFallback(
    () => apiUpdateProject(id, data),
    () => mockCreateProject(data) // Для моков используем create как fallback
  );
}

export async function importProjectsFromTeamPro(data: ImportProjectsFromTeamProRequest): Promise<ImportProjectsResponse> {
  return withApiFallback(
    () => apiImportProjects(data),
    () => mockImportProjects(data)
  );
}

export async function fetchProjectList(): Promise<GetProjectListResponse> {
  return withApiFallback(
    () => apiFetchProjectList(),
    async () => ({
      completed: true,
      message: 'OK',
      projects: mockProjects.map(p => p.id)
    })
  );
}

export async function deleteProject(id: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteProject(id),
    async () => { console.log(`Удаление проекта ${id}`); }
  );
}

export async function addStudentToProject(projectId: string, studentId: string): Promise<void> {
  return withApiFallback(
    () => apiAddStudentToProject(projectId, studentId),
    async () => { console.log(`Добавление студента ${studentId} в проект ${projectId}`); }
  );
}

export async function removeStudentFromProject(projectId: string, studentId: string): Promise<void> {
  return withApiFallback(
    () => apiRemoveStudentFromProject(projectId, studentId),
    async () => { console.log(`Удаление студента ${studentId} из проекта ${projectId}`); }
  );
}

/**
 * Создает новый проект через наш API
 * Отправляет данные на сервер, который разрабатывает другой участник команды
 */
export async function createProjectAPI(data: Omit<Project, "id">): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ошибка создания проекта: ${response.statusText}`);
    }

    const createdProject = await response.json();
    return createdProject;
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    throw error;
  }
}

/**
 * Загружает список проектов из внешнего сервиса Тимпр через наш API
 * Наш API имеет эндпоинт для обращения к внешнему сервису
 */
export async function fetchProjectsFromTimpr(): Promise<Project[]> {
  try {
    // Обращаемся к нашему API, который уже интегрирован с внешним сервисом Тимпр
    const response = await fetch(`${API_BASE_URL}/timpr/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки проектов из Тимпр: ${response.statusText}`);
    }

    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error('Ошибка при загрузке проектов из Тимпр:', error);
    // В случае ошибки возвращаем пустой массив
    return [];
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}