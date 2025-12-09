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

// Milestones selectors
export const selectMilestones = (s: RootState) => s.milestones.items;
export const selectMilestonesLoading = (s: RootState) => s.milestones.loading;
export const selectMilestonesError = (s: RootState) => s.milestones.error;
export const selectMilestonesFilter = (s: RootState) => s.milestones.filter;
export const selectMilestonesSorting = (s: RootState) => ({ sortBy: s.milestones.sortBy, sortOrder: s.milestones.sortOrder });

// Фильтрованные и отсортированные милстоуны
export const selectFilteredMilestones = (s: RootState) => {
  const { items, filter, sortBy, sortOrder } = s.milestones;
  let filtered = items;

  // Фильтрация по типу
  if (filter.type && filter.type !== 'all') {
    filtered = filtered.filter(m => m.type === filter.type);
  }

  // Фильтрация по проекту
  if (filter.projectId) {
    filtered = filtered.filter(m => m.projectId === filter.projectId);
  }

  // Фильтрация по статусу
  if (filter.status && filter.status.length > 0) {
    filtered = filtered.filter(m => filter.status!.includes(m.status));
  }

  // Фильтрация по поисковому запросу
  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(m => 
      m.title.toLowerCase().includes(query) || 
      m.description?.toLowerCase().includes(query)
    );
  }

  // Сортировка
  filtered.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'targetDate':
        aValue = new Date(a.targetDate).getTime();
        bValue = new Date(b.targetDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'status':
        const statusOrder = { 'pending': 1, 'in_progress': 2, 'completed': 3, 'overdue': 4 };
        aValue = statusOrder[a.status];
        bValue = statusOrder[b.status];
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  return filtered;
};

// Милстоуны по проекту
export const selectMilestonesByProject = (projectId: string) => (s: RootState) =>
  s.milestones.items.filter(m => m.projectId === projectId);

// Глобальные милстоуны
export const selectGlobalMilestones = (s: RootState) =>
  s.milestones.items.filter(m => m.type === 'global');

// Локальные милстоуны проекта
export const selectLocalMilestonesByProject = (projectId: string) => (s: RootState) =>
  s.milestones.items.filter(m => m.type === 'local' && m.projectId === projectId);

// Просроченные милстоуны
export const selectOverdueMilestones = (s: RootState) => {
  const now = new Date();
  return s.milestones.items.filter(m => 
    m.status !== 'completed' && new Date(m.targetDate) < now
  );
};

// Милстоуны с дедлайнами на этой неделе
export const selectUpcomingMilestones = (s: RootState) => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return s.milestones.items.filter(m => {
    const targetDate = new Date(m.targetDate);
    return targetDate >= now && targetDate <= nextWeek && m.status !== 'completed';
  });
};