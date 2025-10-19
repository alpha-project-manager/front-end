import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Meeting, MeetingSlotOption, ParticipantAvailability } from "@/types/meeting";
import { createMeeting, proposeSlots, chooseOptimalSlot, sendNotifications } from "@/services/meetings";

interface MeetingsState {
  items: Meeting[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: MeetingsState = {
  items: [],
  status: "idle",
};

export const addMeeting = createAsyncThunk("meetings/add", async (payload: Omit<Meeting, "id" | "selectedSlot" | "notificationsSent">) => {
  return await createMeeting(payload);
});

export const addSlots = createAsyncThunk(
  "meetings/slots",
  async ({ meetingId, slots }: { meetingId: string; slots: MeetingSlotOption[] }) => {
    return await proposeSlots(meetingId, slots);
  }
);

export const pickOptimal = createAsyncThunk(
  "meetings/pickOptimal",
  async ({ meetingId, availability }: { meetingId: string; availability: ParticipantAvailability[] }) => {
    return await chooseOptimalSlot(meetingId, availability);
  }
);

export const notifyParticipants = createAsyncThunk("meetings/notify", async (meetingId: string) => {
  await sendNotifications(meetingId);
  return meetingId;
});

const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMeeting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addMeeting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addMeeting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addSlots.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(pickOptimal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default meetingsSlice.reducer;


