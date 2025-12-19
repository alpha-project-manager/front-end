import { StudentResponse, StudentListResponse, CreateStudentRequest, UpdateStudentRequest } from "@/types/student";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockStudents: StudentResponse[] = [
  {
    id: "s1",
    firstName: "Иван",
    lastName: "Иванов",
    patronymic: "Иванович",
    academicGroup: "ИВТ-101",
    role: {
      id: "r1",
      title: "Разработчик"
    }
  },
  {
    id: "s2",
    firstName: "Мария",
    lastName: "Петрова",
    patronymic: "Сергеевна",
    academicGroup: "ИВТ-102",
    role: {
      id: "r2",
      title: "Дизайнер"
    }
  }
];

export async function mockFetchStudents(): Promise<StudentResponse[]> {
  await delay(200);
  return mockStudents;
}

export async function mockCreateStudent(data: CreateStudentRequest): Promise<StudentResponse> {
  await delay(150);
  return {
    id: String(Date.now()),
    firstName: data.firstName,
    lastName: data.lastName,
    patronymic: data.patronymic,
    academicGroup: data.academicGroup,
    role: data.roleId ? { id: data.roleId, title: "Роль" } : undefined
  };
}

// ========== API функции ==========
async function apiFetchStudents(): Promise<StudentResponse[]> {
  const response = await apiClient.get<StudentListResponse>(API_ENDPOINTS.students.list);
  return response.students;
}

async function apiCreateStudent(data: CreateStudentRequest): Promise<StudentResponse> {
  return await apiClient.post<StudentResponse>(API_ENDPOINTS.students.create, data);
}

async function apiUpdateStudent(studentId: string, data: UpdateStudentRequest): Promise<StudentResponse> {
  return await apiClient.put<StudentResponse>(API_ENDPOINTS.students.update(studentId), data);
}

async function apiDeleteStudent(studentId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.students.delete(studentId));
}

async function apiFetchStudentProjects(studentId: string): Promise<any[]> {
  return await apiClient.get<any[]>(API_ENDPOINTS.students.projects(studentId));
}

// ========== Публичные функции ==========
export async function fetchStudents(): Promise<StudentResponse[]> {
  return withApiFallback(
    () => apiFetchStudents(),
    () => mockFetchStudents()
  );
}

export async function createStudent(data: CreateStudentRequest): Promise<StudentResponse> {
  return withApiFallback(
    () => apiCreateStudent(data),
    () => mockCreateStudent(data)
  );
}

export async function updateStudent(studentId: string, data: UpdateStudentRequest): Promise<StudentResponse> {
  return withApiFallback(
    () => apiUpdateStudent(studentId, data),
    async () => ({
      id: studentId,
      firstName: data.firstName || "Имя",
      lastName: data.lastName || "Фамилия",
      patronymic: data.patronymic,
      academicGroup: data.academicGroup,
      role: data.roleId ? { id: data.roleId, title: "Роль" } : undefined
    })
  );
}

export async function deleteStudent(studentId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteStudent(studentId),
    async () => { console.log(`Удаление студента ${studentId}`); }
  );
}

export async function fetchStudentProjects(studentId: string): Promise<any[]> {
  return withApiFallback(
    () => apiFetchStudentProjects(studentId),
    async () => []
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}