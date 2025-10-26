import { mockProjects } from "@/data/mockProjects";
import { Project } from "@/types/project";

// Базовый URL для нашего API (замените на реальный адрес)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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


