export interface CreateControlPointRequest {
  createInAllProjects: boolean;
}

export interface DeleteControlPointRequest {
  deleteInAllProjects: boolean;
}

export interface UpdateControlPointRequest {
  title?: string;
  date: string; // DateOnly as string
  updateInAllProjects: boolean;
}

export interface UpdateControlPointInProjectRequest {
  controlPointTemplateId?: string; // Guid as string
  videoUrl?: string;
  title?: string;
  completed: boolean;
  companyMark: number;
  urfuMark: number;
  date: string; // DateOnly as string
  hasMarkInTeamPro: boolean;
}

export interface ControlPointResponse {
  id: string; // Guid as string
  title?: string;
  date: string; // DateOnly as string
}

export interface ControlPointListResponse {
  controlPoints: ControlPointResponse[];
}

export interface ControlPointProjectListResponse {
  controlPoints: ControlPointProjectResponse[];
}

export interface ControlPointProjectResponse {
  id: string; // Guid as string
  controlPointTemplateId?: string; // Guid as string
  videoUrl?: string;
  title?: string;
  completed: boolean;
  companyMark: number;
  urfuMark: number;
  date: string; // DateOnly as string
  hasMarkInTeamPro: boolean;
}