'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { submitVote } from '@/store/slices/votesSlice';

interface CaseLikeButtonProps {
  caseId: string;
  userId?: string;
  showCounts?: boolean;
}

export const CaseLikeButton = ({
  caseId,
  userId,
  showCounts = true,
}: CaseLikeButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  // Получаем данные из Redux store
  const userVotes = useSelector((state: RootState) => state.votes.userVotes);
  const caseVotes = useSelector((state: RootState) => state.votes.votes);
  const currentUserVote = userVotes[caseId];
  const votes = caseVotes[caseId] || [];

  // Подсчитываем лайки и дизлайки
  const likeCount = votes.filter((v) => v.reactionType === 'like').length;
  const dislikeCount = votes.filter((v) => v.reactionType === 'dislike').length;

  const handleVote = (reactionType: 'like' | 'dislike' | 'neutral') => {
    if (!userId) {
      console.warn('User ID is required to vote');
      return;
    }

    setIsLoading(true);
    try {
      // Синхронное действие, работает напрямую с Redux и mock данными
      dispatch(
        submitVote({
          caseId,
          userId,
          reactionType,
        })
      );
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLiked = currentUserVote?.reactionType === 'like';
  const isDisliked = currentUserVote?.reactionType === 'dislike';

  return (
    <div className="flex items-center gap-4">
      {/* Лайк */}
      <button
        onClick={() => handleVote(isLiked ? 'neutral' : 'like')}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
          isLiked
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={userId ? 'Нравится' : 'Требуется авторизация'}
      >
        <span className="text-lg">👍</span>
        {showCounts && (
          <span className="text-sm font-medium">{likeCount}</span>
        )}
      </button>

      {/* Дизлайк */}
      <button
        onClick={() => handleVote(isDisliked ? 'neutral' : 'dislike')}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
          isDisliked
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={userId ? 'Не нравится' : 'Требуется авторизация'}
      >
        <span className="text-lg">👎</span>
        {showCounts && (
          <span className="text-sm font-medium">{dislikeCount}</span>
        )}
      </button>
    </div>
  );
};

export default CaseLikeButton;
