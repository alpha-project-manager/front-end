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

// Votes selectors
export const selectUserVotes = (s: RootState) => s.votes.userVotes;
export const selectCaseVotes = (s: RootState) => s.votes.votes;

export const selectUserVoteForCase = (caseId: string) => (s: RootState) =>
  s.votes.userVotes[caseId] || null;

export const selectCaseVotesForCase = (caseId: string) => (s: RootState) =>
  s.votes.votes[caseId] || [];

export const selectCaseVoteStats = (caseId: string) => (s: RootState) => {
  const votes = s.votes.votes[caseId] || [];
  return {
    likes: votes.filter((v) => v.reactionType === 'like').length,
    dislikes: votes.filter((v) => v.reactionType === 'dislike').length,
    total: votes.length,
  };
};

