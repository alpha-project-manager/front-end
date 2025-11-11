import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CaseVote } from "@/types/database";
import {
  getCaseVotes as getMockCaseVotes,
  getUserVoteForCase as getMockUserVote,
} from "@/data/mockCaseVotes";

interface VotesState {
  votes: Record<string, CaseVote[]>; // caseId -> votes[]
  userVotes: Record<string, CaseVote>; // caseId -> userVote (одна запись на кейс)
}

const initialState: VotesState = {
  votes: {
    'case-1': getMockCaseVotes('case-1'),
    'case-2': getMockCaseVotes('case-2'),
    'case-3': getMockCaseVotes('case-3'),
  },
  userVotes: {},
};

const votesSlice = createSlice({
  name: "votes",
  initialState,
  reducers: {
    /**
     * Отправить голос за кейс
     * Синхронное действие работает напрямую с mock данными
     */
    submitVote: (
      state,
      action: PayloadAction<{
        caseId: string;
        userId: string;
        reactionType: "like" | "dislike" | "neutral";
      }>
    ) => {
      const { caseId, userId, reactionType } = action.payload;

      // Создаем или обновляем голос пользователя
      const vote: CaseVote = {
        id: `vote-${caseId}-${userId}`,
        caseId,
        userId,
        reactionType,
      };

      state.userVotes[caseId] = vote;

      // Инициализируем массив голосов для кейса если его еще нет
      if (!state.votes[caseId]) {
        state.votes[caseId] = [];
      }

      // Удаляем старый голос пользователя если был
      state.votes[caseId] = state.votes[caseId].filter(
        (v) => v.userId !== userId
      );

      // Добавляем новый голос если это не нейтральный
      if (reactionType !== "neutral") {
        state.votes[caseId].push(vote);
      }
    },

    /**
     * Удалить голос пользователя
     */
    removeVote: (
      state,
      action: PayloadAction<{ caseId: string; userId: string }>
    ) => {
      const { caseId, userId } = action.payload;

      // Удаляем голос пользователя
      delete state.userVotes[caseId];

      // Удаляем из списка голосов
      if (state.votes[caseId]) {
        state.votes[caseId] = state.votes[caseId].filter(
          (v) => v.userId !== userId
        );
      }
    },

    /**
     * Загрузить голоса кейса (для инициализации)
     */
    loadCaseVotes: (
      state,
      action: PayloadAction<{ caseId: string }>
    ) => {
      const { caseId } = action.payload;
      if (!state.votes[caseId]) {
        state.votes[caseId] = getMockCaseVotes(caseId);
      }
    },

    /**
     * Загрузить голос пользователя (для инициализации)
     */
    loadUserVote: (
      state,
      action: PayloadAction<{ caseId: string; userId: string }>
    ) => {
      const { caseId, userId } = action.payload;
      const vote = getMockUserVote(caseId, userId);
      if (vote && !state.userVotes[caseId]) {
        state.userVotes[caseId] = vote;
      }
    },
  },
});

export const { submitVote, removeVote, loadCaseVotes, loadUserVote } = votesSlice.actions;
export default votesSlice.reducer;
