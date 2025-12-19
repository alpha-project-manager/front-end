import { StudentRoleResponse, StudentRoleListResponse, CreateStudentRoleRequest, UpdateStudentRoleRequest } from "@/types/student";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockStudentRoles: StudentRoleResponse[] = [
  {
    id: "r1",
    title: "Разработчик"
  },
  {
    id: "r2",
    title: "Дизайнер"
  },
  {
    id: "r3",
    title: "Тестировщик"
  }
];

export async function mockFetchStudentRoles(): Promise<StudentRoleResponse[]> {
  await delay(200);
  return mockStudentRoles;
}

export async function mockCreateStudentRole(data: CreateStudentRoleRequest): Promise<StudentRoleResponse> {
  await delay(150);
  return {
    id: String(Date.now()),
    title: data.title
  };
}

// ========== API функции ==========
async function apiFetchStudentRoles(): Promise<StudentRoleResponse[]> {
  const response = await apiClient.get<StudentRoleListResponse>(API_ENDPOINTS.studentRoles.list);
  return response.roles;
}

async function apiCreateStudentRole(data: CreateStudentRoleRequest): Promise<StudentRoleResponse> {
  return await apiClient.post<StudentRoleResponse>(API_ENDPOINTS.studentRoles.create, data);
}

async function apiUpdateStudentRole(roleId: string, data: UpdateStudentRoleRequest): Promise<StudentRoleResponse> {
  return await apiClient.put<StudentRoleResponse>(API_ENDPOINTS.studentRoles.update(roleId), data);
}

async function apiDeleteStudentRole(roleId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.studentRoles.delete(roleId));
}

// ========== Публичные функции ==========
export async function fetchStudentRoles(): Promise<StudentRoleResponse[]> {
  return withApiFallback(
    () => apiFetchStudentRoles(),
    () => mockFetchStudentRoles()
  );
}

export async function createStudentRole(data: CreateStudentRoleRequest): Promise<StudentRoleResponse> {
  return withApiFallback(
    () => apiCreateStudentRole(data),
    () => mockCreateStudentRole(data)
  );
}

export async function updateStudentRole(roleId: string, data: UpdateStudentRoleRequest): Promise<StudentRoleResponse> {
  return withApiFallback(
    () => apiUpdateStudentRole(roleId, data),
    async () => ({
      id: roleId,
      title: data.title
    })
  );
}

export async function deleteStudentRole(roleId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteStudentRole(roleId),
    async () => { console.log(`Удаление роли студента ${roleId}`); }
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}