/**
 * Конфигурация API
 * Используйте переменные окружения для настройки URL API
 */
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000, // 30 секунд
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL,
} as const;

/**
 * Endpoints API
 */
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    register: '/api/auth/register',
    delete: '/api/auth/delete',
    me: '/api/auth/me',
  },

  // Project Cases
  cases: {
    list: '/api/project-cases',
    create: '/api/project-cases',
    brief: (caseId: string) => `/api/project-cases/${caseId}/brief`,
    detail: (caseId: string) => `/api/project-cases/${caseId}`,
    update: (caseId: string) => `/api/project-cases/${caseId}`,
    delete: (caseId: string) => `/api/project-cases/${caseId}`,
    vote: (caseId: string) => `/api/project-cases/${caseId}/vote`,
    unvote: (caseId: string) => `/api/project-cases/${caseId}/unvote`,
  },

  // Projects
  projects: {
    list: '/api/projects',
    create: '/api/projects',
    import: '/api/projects/import-from-team-pro',
    delete: (projectId: string) => `/api/projects/${projectId}`,
    detail: (projectId: string) => `/api/projects/${projectId}`,
    update: (projectId: string) => `/api/projects/${projectId}`,
    removeStudent: (projectId: string, studentId: string) => `/api/projects/${projectId}/students/${studentId}`,
    addStudent: (projectId: string, studentId: string) => `/api/projects/${projectId}/students/${studentId}`,
  },

  // Student Roles
  studentRoles: {
    list: '/api/student-roles',
    create: '/api/student-roles',
    update: (roleId: string) => `/api/student-roles/${roleId}`,
    delete: (roleId: string) => `/api/student-roles/${roleId}`,
  },

  // Control Points in Project
  controlPointsInProject: {
    list: (projectId: string) => `/api/projects/${projectId}/control-points`,
    create: (projectId: string) => `/api/projects/${projectId}/control-points`,
    update: (projectId: string, pointId: string) => `/api/projects/${projectId}/control-points/${pointId}`,
    delete: (projectId: string, pointId: string) => `/api/projects/${projectId}/control-points/${pointId}`,
  },

  // Meetings
  meetings: {
    create: (projectId: string) => `/api/projects/${projectId}/meetings`,
    list: (projectId: string) => `/api/projects/${projectId}/meetings`,
    detail: (projectId: string, meetingId: string) => `/api/projects/${projectId}/meetings/${meetingId}`,
    update: (projectId: string, meetingId: string) => `/api/projects/${projectId}/meetings/${meetingId}`,
    delete: (projectId: string, meetingId: string) => `/api/projects/${projectId}/meetings/${meetingId}`,
    updateStudentAttendance: (projectId: string, meetingId: string, studentId: string) =>
      `/api/projects/${projectId}/meetings/${meetingId}/attendances/student/${studentId}`,
    updateTutorAttendance: (projectId: string, meetingId: string, tutorId: string) =>
      `/api/projects/${projectId}/meetings/${meetingId}/attendances/tutor/${tutorId}`,
  },

  // Applications
  applications: {
    list: '/api/applications',
    detail: (applicationId: string) => `/api/applications/${applicationId}`,
    update: (applicationId: string) => `/api/applications/${applicationId}`,
    delete: (applicationId: string) => `/api/applications/${applicationId}`,
    sendMessage: (applicationId: string) => `/api/applications/${applicationId}/send-message`,
  },

  // Application Questions
  questions: {
    list: '/api/applications/questions',
    create: '/api/applications/questions',
    detail: (questionId: string) => `/api/applications/questions/${questionId}`,
    delete: (questionId: string) => `/api/applications/questions/${questionId}`,
    update: (questionId: string) => `/api/applications/questions/${questionId}`,
  },

  // Control Points (Global)
  controlPoints: {
    list: '/api/control-points',
    create: '/api/control-points',
    update: (pointId: string) => `/api/control-points/${pointId}`,
    delete: (pointId: string) => `/api/control-points/${pointId}`,
  },

  // Students
  students: {
    list: '/api/students',
    create: '/api/students',
    projects: (studentId: string) => `/api/students/${studentId}/projects`,
    update: (studentId: string) => `/api/students/${studentId}`,
    delete: (studentId: string) => `/api/students/${studentId}`,
  },

  // Todo Tasks
  tasks: {
    create: '/api/tasks',
    delete: (taskId: string) => `/api/tasks/${taskId}`,
    update: (taskId: string) => `/api/tasks/${taskId}`,
    complete: (taskId: string) => `/api/tasks/${taskId}/complete`,
  },

  // Tutors
  tutors: {
    create: '/api/tutors',
    list: '/api/tutors',
    detail: (tutorId: string) => `/api/tutors/${tutorId}`,
    update: (tutorId: string) => `/api/tutors/${tutorId}`,
    delete: (tutorId: string) => `/api/tutors/${tutorId}`,
  },

  // Calendar Settings
  calendar: {
    update: '/calendar-settings',
  },

  // Test
  test: {
    getAllProjects: '/test/get-all-projects',
  },
} as const;