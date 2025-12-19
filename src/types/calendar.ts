export type CalendarProvider = "YANDEX" | "NONE";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO datetime
  end: string;   // ISO datetime
  attendees: string[]; // userIds
  location?: string;
  provider: CalendarProvider;
  reminders?: Array<{ minutesBefore: number }>;
}

export interface AvailabilitySlot {
  userId: string;
  start: string;
  end: string;
}

// Server calendar types
export interface UpdateCalendarSettingsRequest {
  serverUrl: string;
  login?: string;
  password?: string;
}

export interface CalendarSettingResponse {
  serverUrl: string;
  login?: string;
  password?: string;
}