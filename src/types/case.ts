import { CaseReactionType } from './enums';

export interface CaseVoteRequest {
  reactionType: CaseReactionType;
}

export interface UpdateCaseRequest {
  title: string;
  description: string;
  goal: string;
  requestedResult: string;
  criteria: string;
  tutorId?: string; // Guid as string
  maxTeams: number;
  isActive: boolean;
}

export interface CaseVoteResponse {
  userId: string; // Guid as string
  fullName?: string;
}

export interface ProjectCaseBriefResponse {
  id: string; // Guid as string
  title: string;
  tutorId?: string; // Guid as string
  tutorFio?: string;
  maxTeams: number;
  acceptedTeams: number;
  isActive: boolean;
  updatedAt: string; // DateTime as string
  votes: { [key in CaseReactionType]: CaseVoteResponse[] };
}

export interface ProjectCaseFullResponse {
  completed: boolean;
  message: string;
  id: string; // Guid as string
  title: string;
  description: string;
  goal: string;
  requestedResult: string;
  criteria: string;
  tutorId?: string; // Guid as string
  tutorFio?: string;
  maxTeams: number;
  acceptedTeams: number;
  isActive: boolean;
  updatedAt: string; // DateTime as string
}

export interface ProjectCaseListResponse {
  completed: boolean;
  message: string;
  cases: ProjectCaseBriefResponse[];
}