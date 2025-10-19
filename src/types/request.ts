export type RequestStatus = "pending" | "approved" | "rejected" | "scheduled";

export interface PreRecordRequest {
  id: string;
  createdBy: string; // userId команды (из тг-бота или сервиса)
  source: "telegram_bot" | "bank_portal";
  projectId?: string; // если привязано к проекту
  preferredSlots: Array<{ start: string; end: string }>;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  votes?: Array<{ userId: string; vote: 1 | -1 }>;
}


