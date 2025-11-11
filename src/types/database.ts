/**
 * Типы данных на основе ER-диаграммы
 */

// ========== User & Auth ==========
export interface YaCalendarSettings {
  id: string;
  login: string;
  password: string;
  serverUrl: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  calendarSettingsId?: string;
  tutorId?: string;
  calendarSettings?: YaCalendarSettings;
}

// ========== Students ==========
export interface StudentRole {
  id: string;
  title: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  roleId: string;
  academicGroup?: string;
  role?: StudentRole;
}

export interface StudentInProject {
  projectId: string;
  studentId: string;
  project?: Project;
  student?: Student;
}

// ========== Tutors ==========
export interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
}

// ========== Projects ==========
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';
export type Semester = 'Spring' | 'Autumn';

export interface Project {
  id: string;
  caseId: string;
  tutorId: string;
  title: string;
  description?: string;
  meetingUrl?: string;
  teamTitle?: string;
  status: ProjectStatus;
  semester: Semester;
  academicYear: string;
  case?: ProjectCase;
  tutor?: Tutor;
  students?: Student[];
}

// ========== Project Cases ==========
export interface ProjectCase {
  id: string;
  title: string;
  description?: string;
  goal?: string;
  requestedResult?: string;
  criteria?: string;
  tutor?: string;
  maxTeams: number;
  acceptedTeams: number;
  isActive: boolean;
}

export interface CaseVote {
  id: string;
  caseId: string;
  userId: string;
  reactionType: 'like' | 'dislike' | 'neutral';
  case?: ProjectCase;
  user?: User;
}

// ========== Applications ==========
export type ApplicationStatus = 'draft' | 'submitted' | 'reviewed' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  caseId: string;
  currentQuestionId?: string;
  teamTitle: string;
  status: ApplicationStatus;
  chatId?: string;
  telegramUsername?: string;
  case?: ProjectCase;
  currentQuestion?: ApplicationQuestion;
  questions?: ApplicationQuestionAnswer[];
  messages?: ApplicationMessage[];
}

export interface ApplicationQuestion {
  id: string;
  title: string;
  msgText?: string;
  nextQuestionId?: string;
  prevQuestionId?: string;
  nextQuestion?: ApplicationQuestion;
  prevQuestion?: ApplicationQuestion;
}

export interface ApplicationQuestionAnswer {
  id: string;
  applicationId: string;
  questionTitle: string;
  answer: string;
  timestamp: string;
  application?: Application;
}

export interface ApplicationMessage {
  id: string;
  applicationId: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  timestamp: string;
  isRead: boolean;
  application?: Application;
}

// ========== Meetings ==========
export interface Meeting {
  id: string;
  projectId: string;
  title?: string;
  description?: string;
  resultMark?: number;
  isFinished: boolean;
  dateTime: string;
  project?: Project;
  tasks?: TodoTask[];
  studentAttendance?: StudentAttendance[];
  tutorAttendance?: TutorAttendance[];
}

export interface StudentAttendance {
  id: string;
  meetingId: string;
  studentId: string;
  attended: boolean;
  meeting?: Meeting;
  student?: Student;
}

export interface TutorAttendance {
  id: string;
  meetingId: string;
  tutorId: string;
  attended: boolean;
  meeting?: Meeting;
  tutor?: Tutor;
}

// ========== Tasks ==========
export interface TodoTask {
  id: string;
  meetingId: string;
  isCompleted: boolean;
  title: string;
  meeting?: Meeting;
}

// ========== Control Points ==========
export interface ControlPoint {
  id: string;
  title: string;
  date: string;
}

export interface ControlPointInProject {
  id: string;
  controlPointId: string;
  projectId: string;
  videoUrl?: string;
  companyMark?: number;
  urfuMark?: number;
  completed: boolean;
  date: string;
  title: string;
  hasMarkinTeamPro: boolean;
  controlPoint?: ControlPoint;
  project?: Project;
}

// ========== DTOs для API ==========
export interface CreateProjectDto {
  caseId: string;
  tutorId: string;
  title: string;
  description?: string;
  meetingUrl?: string;
  teamTitle?: string;
  semester: Semester;
  academicYear: string;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  meetingUrl?: string;
  teamTitle?: string;
  status?: ProjectStatus;
}

export interface CreateApplicationDto {
  caseId: string;
  teamTitle: string;
  telegramUsername?: string;
}

export interface CreateMeetingDto {
  projectId: string;
  description?: string;
  dateTime: string;
}

export interface UpdateMeetingDto {
  description?: string;
  resultMark?: number;
  isFinished?: boolean;
  dateTime?: string;
}

export interface CreateTaskDto {
  meetingId: string;
  title: string;
}

export interface UpdateTaskDto {
  isCompleted?: boolean;
  title?: string;
}

export interface CreateControlPointInProjectDto {
  controlPointId: string;
  projectId: string;
  videoUrl?: string;
  companyMark?: number;
  urfuMark?: number;
  date: string;
  title: string;
}

export interface UpdateControlPointInProjectDto {
  videoUrl?: string;
  companyMark?: number;
  urfuMark?: number;
  completed?: boolean;
  date?: string;
  title?: string;
  hasMarkinTeamPro?: boolean;
}

