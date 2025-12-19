export interface CreateNewTutorRequest {
  firstName: string;
  lastName?: string;
  patronymic?: string;
}

export interface UpdateTutorRequest {
  firstName: string;
  lastName?: string;
  patronymic?: string;
}

export interface TutorResponse {
  id: string; // Guid as string
  firstName: string;
  lastName?: string;
  patronymic?: string;
  fullName: string;
}

export interface TutorsListResponse {
  tutors: TutorResponse[];
}