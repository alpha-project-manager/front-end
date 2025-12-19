export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  patronymic?: string;
  academicGroup?: string;
  roleId?: string; // Guid as string
}

export interface UpdateStudentRequest {
  firstName: string;
  lastName: string;
  patronymic?: string;
  academicGroup?: string;
  roleId?: string; // Guid as string
}

export interface CreateStudentRoleRequest {
  title: string;
}

export interface UpdateStudentRoleRequest {
  title: string;
}

export interface StudentRoleListResponse {
  roles: StudentRoleResponse[];
}

export interface StudentRoleResponse {
  id: string; // Guid as string
  title: string;
}

export interface StudentListResponse {
  students: StudentResponse[];
}

export interface StudentResponse {
  id: string; // Guid as string
  firstName: string;
  lastName: string;
  patronymic?: string;
  academicGroup?: string;
  role?: StudentRoleResponse;
}