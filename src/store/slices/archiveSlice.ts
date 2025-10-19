import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "@/types/project";

interface ArchiveState {
  items: Project[];
}

const initialState: ArchiveState = {
  items: [],
};

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {
    addToArchive(state, action: PayloadAction<Project>) {
      state.items.push(action.payload);
    },
    removeFromArchive(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    updateArchivedProject(state, action: PayloadAction<{ id: string; changes: Partial<Project> }>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload.changes };
    },
  },
});

export const { addToArchive, removeFromArchive, updateArchivedProject } = archiveSlice.actions;
export default archiveSlice.reducer;


