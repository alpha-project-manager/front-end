import { QuestionResponse, QuestionListResponse, UpdateQuestionRequest } from "@/types/question";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockQuestions: QuestionResponse[] = [
  {
    id: "q1",
    title: "Расскажите о вашем опыте",
    msgText: "Опишите ваш предыдущий опыт работы над проектами",
    prevQuestionId: undefined,
    nextQuestionId: "q2"
  },
  {
    id: "q2",
    title: "Почему вы хотите участвовать?",
    msgText: "Расскажите о вашей мотивации",
    prevQuestionId: "q1",
    nextQuestionId: undefined
  }
];

export async function mockFetchQuestions(): Promise<QuestionResponse[]> {
  await delay(200);
  return mockQuestions;
}

export async function mockCreateQuestion(data: UpdateQuestionRequest): Promise<QuestionResponse> {
  await delay(150);
  return {
    id: String(Date.now()),
    title: data.title,
    msgText: data.msgText,
    prevQuestionId: undefined,
    nextQuestionId: undefined
  };
}

// ========== API функции ==========
async function apiFetchQuestions(): Promise<QuestionResponse[]> {
  const response = await apiClient.get<QuestionListResponse>(API_ENDPOINTS.questions.list);
  return response.questions;
}

async function apiCreateQuestion(data: UpdateQuestionRequest): Promise<QuestionResponse> {
  return await apiClient.post<QuestionResponse>(API_ENDPOINTS.questions.create, data);
}

async function apiUpdateQuestion(questionId: string, data: UpdateQuestionRequest): Promise<QuestionResponse> {
  return await apiClient.put<QuestionResponse>(API_ENDPOINTS.questions.update(questionId), data);
}

async function apiFetchQuestion(questionId: string): Promise<QuestionResponse> {
  return await apiClient.get<QuestionResponse>(API_ENDPOINTS.questions.detail(questionId));
}

async function apiDeleteQuestion(questionId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.questions.delete(questionId));
}

// ========== Публичные функции ==========
export async function fetchQuestions(): Promise<QuestionResponse[]> {
  return withApiFallback(
    () => apiFetchQuestions(),
    () => mockFetchQuestions()
  );
}

export async function fetchQuestion(questionId: string): Promise<QuestionResponse> {
  return withApiFallback(
    () => apiFetchQuestion(questionId),
    async () => mockQuestions.find(q => q.id === questionId) || mockQuestions[0]
  );
}

export async function createQuestion(data: UpdateQuestionRequest): Promise<QuestionResponse> {
  return withApiFallback(
    () => apiCreateQuestion(data),
    () => mockCreateQuestion(data)
  );
}

export async function updateQuestion(questionId: string, data: UpdateQuestionRequest): Promise<QuestionResponse> {
  return withApiFallback(
    () => apiUpdateQuestion(questionId, data),
    async () => ({
      id: questionId,
      title: data.title,
      msgText: data.msgText,
      prevQuestionId: undefined,
      nextQuestionId: undefined
    })
  );
}

export async function deleteQuestion(questionId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteQuestion(questionId),
    async () => { console.log(`Удаление вопроса ${questionId}`); }
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}