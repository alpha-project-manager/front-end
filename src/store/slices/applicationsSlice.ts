import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ApplicationBriefResponse, ApplicationResponse, UpdateApplicationRequest, SendMessageRequest } from "@/types/application";
import { fetchApplications, fetchApplication, updateApplication, sendMessage } from "@/services/applications";

interface ApplicationsState {
  items: ApplicationBriefResponse[];
  currentApplication: ApplicationResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  currentStatus: "idle" | "loading" | "succeeded" | "failed";
  currentError?: string;
}

const initialState: ApplicationsState = {
  items: [],
  currentApplication: null,
  status: "idle",
  currentStatus: "idle",
};

// Async thunks
export const loadApplications = createAsyncThunk(
  "applications/load",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchApplications();
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки заявок");
    }
  }
);

export const loadApplication = createAsyncThunk(
  "applications/loadOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await fetchApplication(id);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки заявки");
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, data }: { id: string; data: UpdateApplicationRequest }, { rejectWithValue }) => {
    try {
      const updated = await updateApplication(id, data);
      return updated;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка обновления заявки");
    }
  }
);

export const sendApplicationMessage = createAsyncThunk(
  "applications/sendMessage",
  async ({ applicationId, data }: { applicationId: string; data: SendMessageRequest }, { rejectWithValue }) => {
    try {
      const response = await sendMessage(applicationId, data);
      return response;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка отправки сообщения");
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearCurrentApplication(state) {
      state.currentApplication = null;
      state.currentStatus = "idle";
      state.currentError = undefined;
    },
    clearApplications(state) {
      state.items = [];
      state.status = "idle";
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load applications
      .addCase(loadApplications.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(loadApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Load single application
      .addCase(loadApplication.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = undefined;
      })
      .addCase(loadApplication.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.currentApplication = action.payload;
      })
      .addCase(loadApplication.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Update application
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.currentApplication = action.payload;
        // Update in items list
        const index = state.items.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            id: action.payload.id,
            caseId: action.payload.caseId,
            caseTitle: action.payload.caseTitle,
            teamTitle: action.payload.teamTitle,
            status: action.payload.status,
            updatedAt: action.payload.updatedAt,
            unreadMessagesCount: 0 // Reset unread count after update
          };
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      });
  },
});

export const { clearCurrentApplication, clearApplications } = applicationsSlice.actions;
export default applicationsSlice.reducer;