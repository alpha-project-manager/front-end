import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ProjectCaseBriefResponse, ProjectCaseFullResponse, UpdateCaseRequest, CaseVoteRequest } from "@/types/case";
import { fetchCases, fetchCase, updateCase, voteCase } from "@/services/cases";

interface CasesState {
  items: ProjectCaseBriefResponse[];
  currentCase: ProjectCaseFullResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  currentStatus: "idle" | "loading" | "succeeded" | "failed";
  currentError?: string;
}

const initialState: CasesState = {
  items: [],
  currentCase: null,
  status: "idle",
  currentStatus: "idle",
};

// Async thunks
export const loadCases = createAsyncThunk(
  "cases/load",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCases();
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки кейсов");
    }
  }
);

export const loadCase = createAsyncThunk(
  "cases/loadOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await fetchCase(id);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки кейса");
    }
  }
);

export const updateCaseData = createAsyncThunk(
  "cases/update",
  async ({ id, data }: { id: string; data: UpdateCaseRequest }, { rejectWithValue }) => {
    try {
      const updated = await updateCase(id, data);
      return updated;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка обновления кейса");
    }
  }
);

export const voteCaseData = createAsyncThunk(
  "cases/vote",
  async ({ caseId, data }: { caseId: string; data: CaseVoteRequest }, { rejectWithValue }) => {
    try {
      await voteCase(caseId, data);
      return { caseId, reactionType: data.reactionType };
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка голосования");
    }
  }
);

const casesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    clearCurrentCase(state) {
      state.currentCase = null;
      state.currentStatus = "idle";
      state.currentError = undefined;
    },
    clearCases(state) {
      state.items = [];
      state.status = "idle";
      state.error = undefined;
    },
    updateCaseVote(state, action: { payload: { caseId: string; reactionType: number; userId: string } }) {
      const { caseId, reactionType, userId } = action.payload;
      const caseItem = state.items.find(c => c.id === caseId);
      if (caseItem) {
        // Remove existing vote from this user
        Object.keys(caseItem.votes).forEach(key => {
          const voteType = parseInt(key) as 0 | 1 | 2;
          caseItem.votes[voteType] = caseItem.votes[voteType].filter(vote => vote.userId !== userId);
        });
        
        // Add new vote
        caseItem.votes[reactionType as 0 | 1 | 2].push({ userId, fullName: "Пользователь" });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load cases
      .addCase(loadCases.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(loadCases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadCases.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Load single case
      .addCase(loadCase.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = undefined;
      })
      .addCase(loadCase.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.currentCase = action.payload;
      })
      .addCase(loadCase.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Update case
      .addCase(updateCaseData.fulfilled, (state, action) => {
        state.currentCase = action.payload;
        // Update in items list
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            id: action.payload.id,
            title: action.payload.title,
            tutorId: action.payload.tutorId,
            tutorFio: action.payload.tutorFio,
            maxTeams: action.payload.maxTeams,
            acceptedTeams: action.payload.acceptedTeams,
            isActive: action.payload.isActive,
            updatedAt: action.payload.updatedAt,
            votes: state.items[index].votes // Keep existing votes
          };
        }
      })
      .addCase(updateCaseData.rejected, (state, action) => {
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      });
  },
});

export const { clearCurrentCase, clearCases, updateCaseVote } = casesSlice.actions;
export default casesSlice.reducer;