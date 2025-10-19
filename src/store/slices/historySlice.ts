import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HistoryItem {
  id: string;
  type: "meeting" | "project" | "communication" | "task";
  refId: string; // id связанной сущности
  timestamp: string;
  summary: string;
  university?: string;
  team?: string;
}

interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistory(state, action: PayloadAction<HistoryItem>) {
      state.items.push(action.payload);
    },
  },
});

export const { addHistory } = historySlice.actions;
export default historySlice.reducer;


