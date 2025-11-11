import type { CaseVote } from '@/types/database';

/**
 * Mock данные голосов за кейсы
 * В реальном приложении эти данные будут загружаться с backend
 */
export const mockCaseVotes: CaseVote[] = [
  {
    id: 'vote-1',
    caseId: 'case-1',
    userId: 'user-1',
    reactionType: 'like',
  },
  {
    id: 'vote-2',
    caseId: 'case-1',
    userId: 'user-2',
    reactionType: 'like',
  },
  {
    id: 'vote-3',
    caseId: 'case-1',
    userId: 'user-3',
    reactionType: 'dislike',
  },
  {
    id: 'vote-4',
    caseId: 'case-2',
    userId: 'user-1',
    reactionType: 'like',
  },
  {
    id: 'vote-5',
    caseId: 'case-2',
    userId: 'user-2',
    reactionType: 'like',
  },
  {
    id: 'vote-6',
    caseId: 'case-2',
    userId: 'user-4',
    reactionType: 'like',
  },
  {
    id: 'vote-7',
    caseId: 'case-2',
    userId: 'user-5',
    reactionType: 'dislike',
  },
  {
    id: 'vote-8',
    caseId: 'case-3',
    userId: 'user-1',
    reactionType: 'like',
  },
  {
    id: 'vote-9',
    caseId: 'case-3',
    userId: 'user-3',
    reactionType: 'like',
  },
  {
    id: 'vote-10',
    caseId: 'case-3',
    userId: 'user-4',
    reactionType: 'like',
  },
  {
    id: 'vote-11',
    caseId: 'case-3',
    userId: 'user-5',
    reactionType: 'like',
  },
  {
    id: 'vote-12',
    caseId: 'case-3',
    userId: 'user-6',
    reactionType: 'dislike',
  },
];

/**
 * Получить статистику голосов за кейс
 */
export const getCaseVoteStats = (caseId: string) => {
  const votes = mockCaseVotes.filter((v) => v.caseId === caseId);
  return {
    likes: votes.filter((v) => v.reactionType === 'like').length,
    dislikes: votes.filter((v) => v.reactionType === 'dislike').length,
  };
};

/**
 * Получить голос конкретного пользователя за кейс
 */
export const getUserVoteForCase = (caseId: string, userId: string) => {
  return mockCaseVotes.find(
    (v) => v.caseId === caseId && v.userId === userId
  ) || null;
};

/**
 * Получить все голоса за кейс
 */
export const getCaseVotes = (caseId: string) => {
  return mockCaseVotes.filter((v) => v.caseId === caseId);
};
