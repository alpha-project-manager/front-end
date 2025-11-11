/**
 * API сервис для работы с проектами
 * Использует API клиент для взаимодействия с бэкендом
 */
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types/database';

export const projectsApi = {
  /**
   * Получить все проекты
   */
  getAll: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>(API_ENDPOINTS.projects.base);
  },

  /**
   * Получить проект по ID
   */
  getById: async (id: string): Promise<Project> => {
    return apiClient.get<Project>(API_ENDPOINTS.projects.byId(id));
  },

  /**
   * Получить проекты по кейсу
   */
  getByCase: async (caseId: string): Promise<Project[]> => {
    return apiClient.get<Project[]>(API_ENDPOINTS.projects.byCase(caseId));
  },

  /**
   * Получить проекты по куратору
   */
  getByTutor: async (tutorId: string): Promise<Project[]> => {
    return apiClient.get<Project[]>(API_ENDPOINTS.projects.byTutor(tutorId));
  },

  /**
   * Создать новый проект
   */
  create: async (data: CreateProjectDto): Promise<Project> => {
    return apiClient.post<Project>(API_ENDPOINTS.projects.base, data);
  },

  /**
   * Обновить проект
   */
  update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
    return apiClient.patch<Project>(API_ENDPOINTS.projects.byId(id), data);
  },

  /**
   * Архивировать проект
   */
  archive: async (id: string): Promise<Project> => {
    return apiClient.post<Project>(API_ENDPOINTS.projects.archive(id));
  },

  /**
   * Удалить проект
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.projects.byId(id));
  },
};

