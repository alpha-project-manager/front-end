import { RootState } from "./index";

export const selectAuth = (s: RootState) => s.auth;
export const selectCurrentUser = (s: RootState) => s.auth.user;

export const selectProjects = (s: RootState) => s.projects.items;
export const selectProjectsStatus = (s: RootState) => s.projects.status;

export const selectMeetings = (s: RootState) => s.meetings.items;

export const selectTasksByProject = (projectId: string) => (s: RootState) =>
  s.tasks.items.filter((t) => t.projectId === projectId);

export const selectRequests = (s: RootState) => s.requests.items;

export const selectHistory = (s: RootState) => s.history.items;

export const selectCalendar = (s: RootState) => s.calendar;

export const selectTeamProjects = (s: RootState) => s.teamProject.items;

export const selectReports = (s: RootState) => s.reports.items;

export const selectArchive = (s: RootState) => s.archive.items;


