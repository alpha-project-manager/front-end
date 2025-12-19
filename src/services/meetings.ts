import { MeetingBriefResponse, MeetingFullResponse, MeetingBriefListResponse, CreateMeetingRequest, UpdateMeetingRequest, UpdateAttendanceRequest, TodoTaskResponse, AttendanceInfoResponse } from "@/types/meeting";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import { withApiFallback } from "@/lib/api-utils";

// ========== Mock функции ==========
const mockMeetings: MeetingBriefResponse[] = [
  {
    id: "meeting1",
    title: "Встреча команды",
    dateTime: "2024-01-20T14:00:00Z",
    isFinished: false,
    totalTasks: 5,
    completedTasks: 2,
    resultMark: undefined
  },
  {
    id: "meeting2",
    title: "Презентация проекта",
    dateTime: "2024-01-22T10:00:00Z",
    isFinished: true,
    totalTasks: 3,
    completedTasks: 3,
    resultMark: 4.5
  }
];

export async function mockFetchMeetings(): Promise<MeetingBriefResponse[]> {
  await delay(200);
  return mockMeetings;
}

export async function mockFetchMeeting(id: string): Promise<MeetingFullResponse> {
  await delay(150);
  return {
    id,
    description: "Описание встречи",
    resultMark: 4.0,
    isFinished: false,
    dateTime: "2024-01-20T14:00:00Z",
    todoTasks: [
      { id: "task1", isCompleted: true, title: "Подготовить презентацию" },
      { id: "task2", isCompleted: false, title: "Обсудить техническое задание" }
    ],
    studentAttendances: [
      { personId: "student1", fullName: "Иванов И.И.", attended: true },
      { personId: "student2", fullName: "Петров П.П.", attended: false }
    ],
    tutorAttendances: [
      { personId: "tutor1", fullName: "Сидоров С.С.", attended: true }
    ]
  };
}

// ========== API функции ==========
async function apiFetchMeetings(projectId: string): Promise<MeetingBriefResponse[]> {
  const response = await apiClient.get<MeetingBriefListResponse>(API_ENDPOINTS.meetings.list(projectId));
  return response.meetings;
}

async function apiFetchMeeting(projectId: string, meetingId: string): Promise<MeetingFullResponse> {
  return await apiClient.get<MeetingFullResponse>(API_ENDPOINTS.meetings.detail(projectId, meetingId));
}

async function apiCreateMeeting(projectId: string, data: CreateMeetingRequest): Promise<MeetingBriefResponse> {
  return await apiClient.post<MeetingBriefResponse>(API_ENDPOINTS.meetings.create(projectId), data);
}

async function apiUpdateMeeting(projectId: string, meetingId: string, data: UpdateMeetingRequest): Promise<MeetingFullResponse> {
  return await apiClient.put<MeetingFullResponse>(API_ENDPOINTS.meetings.update(projectId, meetingId), data);
}

async function apiUpdateStudentAttendance(projectId: string, meetingId: string, studentId: string, data: UpdateAttendanceRequest): Promise<void> {
  await apiClient.put<void>(API_ENDPOINTS.meetings.updateStudentAttendance(projectId, meetingId, studentId), data);
}

async function apiUpdateTutorAttendance(projectId: string, meetingId: string, tutorId: string, data: UpdateAttendanceRequest): Promise<void> {
  await apiClient.put<void>(API_ENDPOINTS.meetings.updateTutorAttendance(projectId, meetingId, tutorId), data);
}

async function apiDeleteMeeting(projectId: string, meetingId: string): Promise<void> {
  await apiClient.delete<void>(API_ENDPOINTS.meetings.delete(projectId, meetingId));
}

// ========== Публичные функции ==========
export async function fetchMeetings(projectId: string): Promise<MeetingBriefResponse[]> {
  return withApiFallback(
    () => apiFetchMeetings(projectId),
    () => mockFetchMeetings()
  );
}

export async function fetchMeeting(projectId: string, meetingId: string): Promise<MeetingFullResponse> {
  return withApiFallback(
    () => apiFetchMeeting(projectId, meetingId),
    () => mockFetchMeeting(meetingId)
  );
}

export async function createMeeting(projectId: string, data: CreateMeetingRequest): Promise<MeetingBriefResponse> {
  return withApiFallback(
    () => apiCreateMeeting(projectId, data),
    async () => ({
      id: String(Date.now()),
      title: "Новая встреча",
      dateTime: data.dateTime,
      isFinished: false,
      totalTasks: data.todoTasks.length,
      completedTasks: 0
    })
  );
}

export async function updateMeeting(projectId: string, meetingId: string, data: UpdateMeetingRequest): Promise<MeetingFullResponse> {
  return withApiFallback(
    () => apiUpdateMeeting(projectId, meetingId, data),
    () => mockFetchMeeting(meetingId)
  );
}

export async function updateStudentAttendance(projectId: string, meetingId: string, studentId: string, data: UpdateAttendanceRequest): Promise<void> {
  return withApiFallback(
    () => apiUpdateStudentAttendance(projectId, meetingId, studentId, data),
    async () => { console.log(`Обновление посещаемости студента ${studentId} для встречи ${meetingId}`); }
  );
}

export async function updateTutorAttendance(projectId: string, meetingId: string, tutorId: string, data: UpdateAttendanceRequest): Promise<void> {
  return withApiFallback(
    () => apiUpdateTutorAttendance(projectId, meetingId, tutorId, data),
    async () => { console.log(`Обновление посещаемости тьютора ${tutorId} для встречи ${meetingId}`); }
  );
}

export async function deleteMeeting(projectId: string, meetingId: string): Promise<void> {
  return withApiFallback(
    () => apiDeleteMeeting(projectId, meetingId),
    async () => { console.log(`Удаление встречи ${meetingId} из проекта ${projectId}`); }
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}