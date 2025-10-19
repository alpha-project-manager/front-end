export interface ParticipantAvailability {
  userId: string;
  busySlots: Array<{ start: string; end: string }>;
}

export interface MeetingSlotOption {
  start: string; // ISO datetime
  end: string;   // ISO datetime
  votes: Array<{ userId: string; vote: 1 | -1 }>; // пальцы вверх/вниз
}

export interface Meeting {
  id: string;
  topic: string;
  participants: string[]; // userIds
  location?: string; // место или ссылка
  calendarIntegration?: "YANDEX" | "NONE";
  createdBy: string; // userId
  selectedSlot?: { start: string; end: string };
  slotOptions: MeetingSlotOption[];
  notificationsSent?: boolean;
}


