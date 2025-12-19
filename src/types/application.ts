import { ApplicationStatus } from './enums';

export interface ApplicationBriefResponse {
  id: string; // Guid as string
  caseId: string; // Guid as string
  caseTitle: string;
  teamTitle: string;
  status: ApplicationStatus;
  updatedAt: string; // DateTime as string
  unreadMessagesCount: number;
}

export interface ApplicationQuestionAnswerResponse {
  id: string; // Guid as string
  timeStamp: number; // long as number
  questionTitle: string;
  answer: string;
}

export interface ApplicationResponse {
  completed: boolean;
  message: string;
  id: string; // Guid as string
  caseId: string; // Guid as string
  caseTitle: string;
  teamTitle: string;
  telegramUsername: string;
  status: ApplicationStatus;
  updatedAt: string; // DateTime as string
  questionResponses: ApplicationQuestionAnswerResponse[];
  messages: MessageResponse[];
}

export interface ApplicationBriefListResponse {
  applications: ApplicationBriefResponse[];
}

export interface UpdateApplicationRequest {
  status: ApplicationStatus;
}

// Re-export types from other modules to avoid circular dependencies
import { MessageResponse, MessageListResponse, SendMessageRequest } from './message';

// Re-export for convenience
export type { MessageResponse, MessageListResponse, SendMessageRequest };