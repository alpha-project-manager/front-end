export interface UpdateQuestionRequest {
  title: string;
  msgText: string;
}

export interface QuestionResponse {
  id: string; // Guid as string
  title: string;
  msgText: string;
  prevQuestionId?: string; // Guid as string
  nextQuestionId?: string; // Guid as string
}

export interface QuestionListResponse {
  completed: boolean;
  message: string;
  questions: QuestionResponse[];
}