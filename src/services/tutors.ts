import { TutorResponse, TutorsListResponse, CreateNewTutorRequest, UpdateTutorRequest } from "@/types/tutor";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockTutors: TutorResponse[] = [
  {
    id: "t1",
    firstName: "Иван",
    lastName: "Петров",
    patronymic: "Сергеевич",
    fullName: "Петров Иван Сергеевич"
  },
  {
    id: "t2",
    firstName: "Мария",
    lastName: "Сидорова",
    patronymic: "Александровна",
    fullName: "Сидорова Мария Александровна"
  }
];

export async function mockFetchTutors(): Promise<TutorResponse[]> {
  await delay(200);
  return mockTutors;
}

export async function mockCreateTutor(data: CreateNewTutorRequest): Promise<TutorResponse> {
  await delay(150);
  const fullName = `${data.lastName || ''} ${data.firstName} ${data.patronymic || ''}`.trim();
  return {
    id: String(Date.now()),
    firstName: data.firstName,
    lastName: data.lastName,
    patronymic: data.patronymic,
    fullName
  };
}

// ========== API функции ==========
async function apiFetchTutors(): Promise<TutorResponse[]> {
  const response = await apiClient.get<TutorsListResponse>(API_ENDPOINTS.tutors.list);
  return response.tutors;
}

async function apiCreateTutor(data: CreateNewTutorRequest): Promise<TutorResponse> {
  return await apiClient.post<TutorResponse>(API_ENDPOINTS.tutors.create, data);
}

async function apiUpdateTutor(tutorId: string, data: UpdateTutorRequest): Promise<TutorResponse> {
  return await apiClient.put<TutorResponse>(API_ENDPOINTS.tutors.update(tutorId), data);
}

async function apiDeleteTutor(tutorId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.tutors.delete(tutorId));
}

async function apiFetchTutor(tutorId: string): Promise<TutorResponse> {
  return await apiClient.get<TutorResponse>(API_ENDPOINTS.tutors.detail(tutorId));
}

// ========== Публичные функции ==========
export async function fetchTutors(): Promise<TutorResponse[]> {
  return withApiFallback(
    () => apiFetchTutors(),
    () => mockFetchTutors()
  );
}

export async function createTutor(data: CreateNewTutorRequest): Promise<TutorResponse> {
  return withApiFallback(
    () => apiCreateTutor(data),
    () => mockCreateTutor(data)
  );
}

export async function updateTutor(tutorId: string, data: UpdateTutorRequest): Promise<TutorResponse> {
  return withApiFallback(
    () => apiUpdateTutor(tutorId, data),
    async () => ({
      id: tutorId,
      firstName: data.firstName || "Имя",
      lastName: data.lastName,
      patronymic: data.patronymic,
      fullName: `${data.lastName || ''} ${data.firstName || ''} ${data.patronymic || ''}`.trim()
    })
  );
}

export async function deleteTutor(tutorId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteTutor(tutorId),
    async () => { console.log(`Удаление тьютора ${tutorId}`); }
  );
}

export async function fetchTutor(tutorId: string): Promise<TutorResponse> {
  return withApiFallback(
    () => apiFetchTutor(tutorId),
    async () => mockTutors.find(t => t.id === tutorId) || mockTutors[0]
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}