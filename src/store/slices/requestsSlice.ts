import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PreRecordRequest, RequestStatus } from "@/types/request";

interface RequestsState {
  items: PreRecordRequest[];
}

const initialState: RequestsState = {
  items: [],
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<PreRecordRequest>) {
      state.items.push(action.payload);
    },
    updateRequestStatus(state, action: PayloadAction<{ id: string; status: RequestStatus }>) {
      const idx = state.items.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.items[idx].status = action.payload.status;
    },
    voteRequest(state, action: PayloadAction<{ id: string; userId: string; vote: 1 | -1 }>) {
      const req = state.items.find((r) => r.id === action.payload.id);
      if (!req) return;
      req.votes = req.votes || [];
      req.votes.push({ userId: action.payload.userId, vote: action.payload.vote });
    },
  },
});

export const { addRequest, updateRequestStatus, voteRequest } = requestsSlice.actions;
export default requestsSlice.reducer;


