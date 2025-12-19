import { AvailabilitySlot, CalendarEvent, CalendarProvider, UpdateCalendarSettingsRequest, CalendarSettingResponse } from "@/types/calendar";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

let events: CalendarEvent[] = [];

export async function syncCalendar(provider: CalendarProvider): Promise<void> {
  await delay(200);
}

export async function createCalendarEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
  await delay(120);
  const created: CalendarEvent = { ...event, id: String(Date.now()) };
  events.push(created);
  return created;
}

export async function listCalendarEvents(userId: string): Promise<CalendarEvent[]> {
  await delay(100);
  return events.filter((e) => e.attendees.includes(userId));
}

export async function getAvailability(userIds: string[], from: string, to: string): Promise<AvailabilitySlot[]> {
  await delay(140);
  // простой мок: все свободны, кроме пары слотов
  return userIds.map((id) => ({ userId: id, start: from, end: to }));
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// ========== API функции ==========
async function apiUpdateCalendarSettings(data: UpdateCalendarSettingsRequest): Promise<CalendarSettingResponse> {
  return await apiClient.put<CalendarSettingResponse>(API_ENDPOINTS.calendar.update, data);
}

// ========== Публичные функции ==========
export async function updateCalendarSettings(data: UpdateCalendarSettingsRequest): Promise<CalendarSettingResponse> {
  return withApiFallback(
    () => apiUpdateCalendarSettings(data),
    async () => ({
      serverUrl: data.serverUrl,
      login: data.login,
      password: data.password
    })
  );
}