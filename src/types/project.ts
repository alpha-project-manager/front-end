export interface Project {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: string;
  endDate?: string;
  team: TeamMember[];
  image?: string;
  curator?: string;
  status?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
}

// Server project types
export interface CreateNewProjectRequest {
  title: string;
  description: string;
  meetingUrl?: string;
  teamTitle: string;
  caseId?: string; // Guid as string
}

export interface ImportProjectsFromTeamProRequest {
  login: string;
  password: string;
}

export interface UpdateProjectRequest {
  caseId?: string; // Guid as string
  title: string;
  description: string;
  tutorId?: string; // Guid as string
  meetingUrl?: string;
  teamTitle?: string;
  status: ProjectStatus;
  semester: Semester;
  academicYear: number;
}

export interface ProjectBriefResponse {
  id: string; // Guid as string
  title: string;
  description?: string;
  teamTitle: string;
  meetingUrl?: string;
  status: ProjectStatus;
  semester: Semester;
  academicYear: number;
  tutor?: TutorResponse;
}

export interface ProjectFullResponse {
  id: string; // Guid as string
  caseId?: string; // Guid as string
  title: string;
  description: string;
  meetingUrl?: string;
  teamTitle: string;
  status: ProjectStatus;
  semester: Semester;
  academicYear: number;
  tutor?: TutorResponse;
  controlPoints: ControlPointProjectResponse[];
  students: StudentResponse[];
  meetings: MeetingBriefResponse[];
}

export interface ProjectBriefListResponse {
  projects: ProjectBriefResponse[];
}

export interface ImportProjectsResponse {
  completed: boolean;
  message: string;
  createdProjects: ProjectBriefResponse[];
  updatedProjects: ProjectBriefResponse[];
}

export interface GetProjectListResponse {
  completed: boolean;
  message: string;
  projects: string[];
}

// Re-export types from other modules to avoid circular dependencies
import { ProjectStatus, Semester } from './enums';
import { TutorResponse } from './tutor';
import { StudentResponse, StudentRoleResponse } from './student';
import { MeetingBriefResponse } from './meeting';
import { ControlPointProjectResponse } from './controlPoint';

// Re-export for convenience
export type { ProjectStatus, Semester };
export type { TutorResponse, StudentResponse, StudentRoleResponse, MeetingBriefResponse, ControlPointProjectResponse };