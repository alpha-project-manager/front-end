import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { MeetingBriefResponse, MeetingFullResponse, CreateMeetingRequest, UpdateMeetingRequest, UpdateAttendanceRequest } from "@/types/meeting";
import { fetchMeetings, fetchMeeting, createMeeting, updateMeeting, updateStudentAttendance as updateStudentAttendanceService, updateTutorAttendance as updateTutorAttendanceService } from "@/services/meetings";

interface MeetingsState {
  items: MeetingBriefResponse[];
  currentMeeting: MeetingFullResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  currentStatus: "idle" | "loading" | "succeeded" | "failed";
  currentError?: string;
}

const initialState: MeetingsState = {
  items: [],
  currentMeeting: null,
  status: "idle",
  currentStatus: "idle",
};

// Async thunks
export const loadMeetings = createAsyncThunk(
  "meetings/load",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const data = await fetchMeetings(projectId);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки встреч");
    }
  }
);

export const loadMeeting = createAsyncThunk(
  "meetings/loadOne",
  async ({ projectId, meetingId }: { projectId: string; meetingId: string }, { rejectWithValue }) => {
    try {
      const data = await fetchMeeting(projectId, meetingId);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки встречи");
    }
  }
);

export const createMeetingThunk = createAsyncThunk(
  "meetings/create",
  async ({ projectId, data }: { projectId: string; data: CreateMeetingRequest }, { rejectWithValue }) => {
    try {
      const meeting = await createMeeting(projectId, data);
      return meeting;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка создания встречи");
    }
  }
);

export const updateMeetingThunk = createAsyncThunk(
  "meetings/update",
  async ({ projectId, meetingId, data }: { projectId: string; meetingId: string; data: UpdateMeetingRequest }, { rejectWithValue }) => {
    try {
      const meeting = await updateMeeting(projectId, meetingId, data);
      return meeting;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка обновления встречи");
    }
  }
);

export const updateStudentAttendance = createAsyncThunk(
  "meetings/updateStudentAttendance",
  async ({ projectId, meetingId, studentId, data }: { projectId: string; meetingId: string; studentId: string; data: UpdateAttendanceRequest }, { rejectWithValue }) => {
    try {
      await updateStudentAttendanceService(projectId, meetingId, studentId, data);
      return { meetingId, studentId, attended: data.attended };
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка обновления посещаемости студента");
    }
  }
);

export const updateTutorAttendance = createAsyncThunk(
  "meetings/updateTutorAttendance",
  async ({ projectId, meetingId, tutorId, data }: { projectId: string; meetingId: string; tutorId: string; data: UpdateAttendanceRequest }, { rejectWithValue }) => {
    try {
      await updateTutorAttendanceService(projectId, meetingId, tutorId, data);
      return { meetingId, tutorId, attended: data.attended };
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка обновления посещаемости тьютора");
    }
  }
);

const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    clearCurrentMeeting(state) {
      state.currentMeeting = null;
      state.currentStatus = "idle";
      state.currentError = undefined;
    },
    clearMeetings(state) {
      state.items = [];
      state.status = "idle";
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load meetings
      .addCase(loadMeetings.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(loadMeetings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadMeetings.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Load single meeting
      .addCase(loadMeeting.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = undefined;
      })
      .addCase(loadMeeting.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.currentMeeting = action.payload;
      })
      .addCase(loadMeeting.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Create meeting
      .addCase(createMeetingThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createMeetingThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Update meeting
      .addCase(updateMeetingThunk.fulfilled, (state, action) => {
        state.currentMeeting = action.payload;
        // Update in items list
        const index = state.items.findIndex((m: MeetingBriefResponse) => m.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            id: action.payload.id,
            title: "Встреча", // MeetingFullResponse doesn't have title, using default
            dateTime: action.payload.dateTime,
            isFinished: action.payload.isFinished,
            totalTasks: action.payload.todoTasks?.length || 0,
            completedTasks: action.payload.todoTasks?.filter(t => t.isCompleted).length || 0,
            resultMark: action.payload.resultMark
          };
        }
      })
      .addCase(updateMeetingThunk.rejected, (state, action) => {
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      // Update attendance
      .addCase(updateStudentAttendance.rejected, (state, action) => {
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      .addCase(updateTutorAttendance.rejected, (state, action) => {
        state.currentError = String(action.payload ?? action.error.message ?? "Ошибка");
      });
  },
});

export const { clearCurrentMeeting, clearMeetings } = meetingsSlice.actions;
export default meetingsSlice.reducer;