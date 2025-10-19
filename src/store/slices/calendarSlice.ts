import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CalendarEvent, CalendarProvider } from "@/types/calendar";
import { createCalendarEvent, listCalendarEvents, syncCalendar } from "@/services/calendar";

interface CalendarState {
  provider: CalendarProvider;
  events: CalendarEvent[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: CalendarState = {
  provider: "YANDEX",
  events: [],
  status: "idle",
};

export const calendarSync = createAsyncThunk("calendar/sync", async (provider: CalendarProvider) => {
  await syncCalendar(provider);
  return provider;
});

export const calendarList = createAsyncThunk("calendar/list", async (userId: string) => {
  return await listCalendarEvents(userId);
});

export const calendarCreateEvent = createAsyncThunk(
  "calendar/create",
  async (payload: Omit<CalendarEvent, "id">) => {
    return await createCalendarEvent(payload);
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calendarSync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(calendarSync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.provider = action.payload;
      })
      .addCase(calendarList.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(calendarCreateEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      });
  },
});

export default calendarSlice.reducer;


