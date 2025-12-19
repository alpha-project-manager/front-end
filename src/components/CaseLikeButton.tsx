'use client';

import { useState, useEffect } from 'react';
import { voteCase, unvoteCase } from '@/services/cases';
import { CaseReactionType } from '@/types/enums';

interface CaseLikeButtonProps {
  caseId: string;
  userId?: string;
  showCounts?: boolean;
  votes: {
    Neutral: { userId: string; fullName?: string }[];
    Positive: { userId: string; fullName?: string }[];
    Negative: { userId: string; fullName?: string }[];
  };
}

export const CaseLikeButton = ({
  caseId,
  userId,
  showCounts = true,
  votes,
}: CaseLikeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentVote, setCurrentVote] = useState<CaseReactionType | null>(null);

  // Определяем текущий голос пользователя
  useEffect(() => {
    if (!userId) return;

    if (votes.Positive.some(v => v.userId === userId)) {
      setCurrentVote(CaseReactionType.Positive);
    } else if (votes.Negative.some(v => v.userId === userId)) {
      setCurrentVote(CaseReactionType.Negative);
    } else {
      setCurrentVote(null);
    }
  }, [userId, votes]);

  // Подсчитываем голоса
  const likeCount = votes.Positive.length;
  const dislikeCount = votes.Negative.length;

  const handleVote = async (reactionType: CaseReactionType | null) => {
    if (!userId) {
      console.warn('User ID is required to vote');
      return;
    }

    setIsLoading(true);
    try {
      if (currentVote !== null && reactionType === null) {
        // Отменить голос
        await unvoteCase(caseId);
        setCurrentVote(null);
      } else if (reactionType !== null) {
        // Проголосовать
        await voteCase(caseId, { reactionType });
        setCurrentVote(reactionType);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLiked = currentVote === CaseReactionType.Positive;
  const isDisliked = currentVote === CaseReactionType.Negative;

  const renderVoteButton = (
    isActive: boolean,
    reactionType: CaseReactionType | null,
    emoji: string,
    count: number,
    title: string,
    activeClasses: string,
    inactiveClasses: string
  ) => (
    <button
      onClick={() => handleVote(isActive ? null : reactionType)}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
        isActive ? activeClasses : inactiveClasses
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={userId ? title : 'Требуется авторизация'}
    >
      <span className="text-lg">{emoji}</span>
      {showCounts && (
        <span className="text-sm font-medium">{count}</span>
      )}
    </button>
  );

  return (
    <div className="flex items-center gap-4">
      {renderVoteButton(
        isLiked,
        CaseReactionType.Positive,
        '👍',
        likeCount,
        'Нравится',
        'bg-green-100 text-green-700 hover:bg-green-200',
        'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
      {renderVoteButton(
        isDisliked,
        CaseReactionType.Negative,
        '👎',
        dislikeCount,
        'Не нравится',
        'bg-red-100 text-red-700 hover:bg-red-200',
        'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
    </div>
  );
};

export default CaseLikeButton;