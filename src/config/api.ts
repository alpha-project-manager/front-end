/**
 * Конфигурация API
 * Используйте переменные окружения для настройки URL API
 */
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 секунд
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL,
} as const;

/**
 * Endpoints API
 */
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  
  // Users
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
    me: '/users/me',
    update: (id: string) => `/users/${id}`,
  },
  
  // Projects
  projects: {
    base: '/projects',
    byId: (id: string) => `/projects/${id}`,
    byCase: (caseId: string) => `/projects?caseId=${caseId}`,
    byTutor: (tutorId: string) => `/projects?tutorId=${tutorId}`,
    archive: (id: string) => `/projects/${id}/archive`,
  },
  
  // Project Cases
  cases: {
    base: '/cases',
    byId: (id: string) => `/cases/${id}`,
    active: '/cases/active',
    votes: (caseId: string) => `/cases/${caseId}/votes`,
  },
  
  // Applications
  applications: {
    base: '/applications',
    byId: (id: string) => `/applications/${id}`,
    byCase: (caseId: string) => `/applications?caseId=${caseId}`,
    messages: (id: string) => `/applications/${id}/messages`,
    questions: (id: string) => `/applications/${id}/questions`,
  },
  
  // Meetings
  meetings: {
    base: '/meetings',
    byId: (id: string) => `/meetings/${id}`,
    byProject: (projectId: string) => `/meetings?projectId=${projectId}`,
    attendance: {
      students: (meetingId: string) => `/meetings/${meetingId}/attendance/students`,
      tutors: (meetingId: string) => `/meetings/${meetingId}/attendance/tutors`,
    },
  },
  
  // Tasks
  tasks: {
    base: '/tasks',
    byId: (id: string) => `/tasks/${id}`,
    byMeeting: (meetingId: string) => `/tasks?meetingId=${meetingId}`,
    complete: (id: string) => `/tasks/${id}/complete`,
  },
  
  // Control Points
  controlPoints: {
    base: '/control-points',
    byId: (id: string) => `/control-points/${id}`,
    inProject: (projectId: string) => `/control-points?projectId=${projectId}`,
  },
  
  // Students
  students: {
    base: '/students',
    byId: (id: string) => `/students/${id}`,
    byProject: (projectId: string) => `/students?projectId=${projectId}`,
    roles: '/students/roles',
  },
  
  // Tutors
  tutors: {
    base: '/tutors',
    byId: (id: string) => `/tutors/${id}`,
  },
  
  // Calendar Settings
  calendar: {
    base: '/calendar/settings',
    sync: '/calendar/sync',
  },
} as const;

