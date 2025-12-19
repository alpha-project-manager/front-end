import { ControlPointResponse, ControlPointListResponse, CreateControlPointRequest, UpdateControlPointRequest } from "@/types/controlPoint";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockControlPoints: ControlPointResponse[] = [
  {
    id: "cp1",
    title: "Контрольная точка 1",
    date: "2024-02-01"
  },
  {
    id: "cp2",
    title: "Контрольная точка 2",
    date: "2024-03-01"
  }
];

export async function mockFetchControlPoints(): Promise<ControlPointResponse[]> {
  await delay(200);
  return mockControlPoints;
}

export async function mockCreateControlPoint(data: CreateControlPointRequest): Promise<ControlPointResponse> {
  await delay(150);
  return {
    id: String(Date.now()),
    title: "Новая контрольная точка",
    date: new Date().toISOString().split('T')[0]
  };
}

// ========== API функции ==========
async function apiFetchControlPoints(): Promise<ControlPointResponse[]> {
  const response = await apiClient.get<ControlPointListResponse>(API_ENDPOINTS.controlPoints.list);
  return response.controlPoints;
}

async function apiCreateControlPoint(data: CreateControlPointRequest): Promise<ControlPointResponse> {
  return await apiClient.post<ControlPointResponse>(API_ENDPOINTS.controlPoints.create, data);
}

async function apiUpdateControlPoint(pointId: string, data: UpdateControlPointRequest): Promise<ControlPointResponse> {
  return await apiClient.put<ControlPointResponse>(API_ENDPOINTS.controlPoints.update(pointId), data);
}

async function apiDeleteControlPoint(pointId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.controlPoints.delete(pointId));
}

// ========== API функции для контрольных точек в проекте ==========
async function apiFetchControlPointsInProject(projectId: string): Promise<ControlPointResponse[]> {
  const response = await apiClient.get<ControlPointListResponse>(API_ENDPOINTS.controlPointsInProject.list(projectId));
  return response.controlPoints;
}

async function apiCreateControlPointInProject(projectId: string, data: CreateControlPointRequest): Promise<ControlPointResponse> {
  return await apiClient.post<ControlPointResponse>(API_ENDPOINTS.controlPointsInProject.create(projectId), data);
}

async function apiUpdateControlPointInProject(projectId: string, pointId: string, data: UpdateControlPointRequest): Promise<ControlPointResponse> {
  return await apiClient.put<ControlPointResponse>(API_ENDPOINTS.controlPointsInProject.update(projectId, pointId), data);
}

async function apiDeleteControlPointInProject(projectId: string, pointId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.controlPointsInProject.delete(projectId, pointId));
}

// ========== Публичные функции ==========
export async function fetchControlPoints(): Promise<ControlPointResponse[]> {
  return withApiFallback(
    () => apiFetchControlPoints(),
    () => mockFetchControlPoints()
  );
}

export async function createControlPoint(data: CreateControlPointRequest): Promise<ControlPointResponse> {
  return withApiFallback(
    () => apiCreateControlPoint(data),
    () => mockCreateControlPoint(data)
  );
}

export async function updateControlPoint(pointId: string, data: UpdateControlPointRequest): Promise<ControlPointResponse> {
  return withApiFallback(
    () => apiUpdateControlPoint(pointId, data),
    async () => ({
      id: pointId,
      title: data.title || "Обновленная точка",
      date: data.date
    })
  );
}

export async function deleteControlPoint(pointId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteControlPoint(pointId),
    async () => { console.log(`Удаление контрольной точки ${pointId}`); }
  );
}

// ========== Публичные функции для контрольных точек в проекте ==========
export async function fetchControlPointsInProject(projectId: string): Promise<ControlPointResponse[]> {
  return withApiFallback(
    () => apiFetchControlPointsInProject(projectId),
    () => mockFetchControlPoints()
  );
}

export async function createControlPointInProject(projectId: string, data: CreateControlPointRequest): Promise<ControlPointResponse> {
  return withApiFallback(
    () => apiCreateControlPointInProject(projectId, data),
    () => mockCreateControlPoint(data)
  );
}

export async function updateControlPointInProject(projectId: string, pointId: string, data: UpdateControlPointRequest): Promise<ControlPointResponse> {
  return withApiFallback(
    () => apiUpdateControlPointInProject(projectId, pointId, data),
    async () => ({
      id: pointId,
      title: data.title || "Обновленная точка",
      date: data.date
    })
  );
}

export async function deleteControlPointInProject(projectId: string, pointId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteControlPointInProject(projectId, pointId),
    async () => { console.log(`Удаление контрольной точки ${pointId} из проекта ${projectId}`); }
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}