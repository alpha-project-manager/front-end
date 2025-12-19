export interface SendMessageRequest {
  content: string;
}

export interface MessageResponse {
  id: string; // Guid as string
  timestamp: number; // long as number
  content: string;
  isRead: boolean;
  fromStudents: boolean;
}

export interface MessageListResponse {
  messages: MessageResponse[];
}