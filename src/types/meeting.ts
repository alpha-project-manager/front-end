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
  topic: string;
  participants: string[]; // userIds
  location?: string; // место или ссылка
  calendarIntegration?: "YANDEX" | "NONE";
  createdBy: string; // userId
  selectedSlot?: { start: string; end: string };
  slotOptions: MeetingSlotOption[];
  notificationsSent?: boolean;
}

// Server meeting types
export interface CreateMeetingRequest {
  dateTime: string; // DateTime as string
  todoTasks: string[];
}

export interface UpdateMeetingRequest {
  description: string;
  resultMark: number;
  isFinished: boolean;
  dateTime: string; // DateTime as string
  todoTasks: TodoTaskResponse[];
}

export interface UpdateAttendanceRequest {
  attended: boolean;
}

export interface MeetingBriefListResponse {
  meetings: MeetingBriefResponse[];
}

export interface MeetingFullResponse {
  id: string; // Guid as string
  description: string;
  resultMark: number;
  isFinished: boolean;
  dateTime: string; // DateTime as string
  todoTasks: TodoTaskResponse[];
  studentAttendances: AttendanceInfoResponse[];
  tutorAttendances: AttendanceInfoResponse[];
}

export interface AttendanceInfoResponse {
  personId: string; // Guid as string
  fullName: string;
  attended: boolean;
}

export interface MeetingResponse {
  id: string; // Guid as string
  projectId: string; // Guid as string
  title: string;
  description?: string;
  resultMark: number;
  isFinished: boolean;
  dateTime: string; // DateTime as string
  studentsAttendances: MeetingAttendanceResponse[];
  tutorsAttendances: MeetingAttendanceResponse[];
  tasks: TodoTaskResponse[];
}

export interface MeetingAttendanceResponse {
  tutorId: string; // Guid as string
  memberFullname: string;
  attended: boolean;
}

// Re-export types from other modules to avoid circular dependencies
import { TodoTaskResponse } from './task';
import { MeetingBriefResponse } from './project';

// Re-export for convenience
export type { TodoTaskResponse, MeetingBriefResponse };