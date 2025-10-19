import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { InteractionReport } from "@/types/report";

interface ReportsState {
  items: InteractionReport[];
}

const initialState: ReportsState = {
  items: [],
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    addReport(state, action: PayloadAction<InteractionReport>) {
      state.items.push(action.payload);
    },
  },
});

export const { addReport } = reportsSlice.actions;
export default reportsSlice.reducer;


