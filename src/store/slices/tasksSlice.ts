import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TaskItem, TaskStatus } from "@/types/task";

interface TasksState {
  items: TaskItem[];
}

const initialState: TasksState = {
  items: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<TaskItem>) {
      state.items.push(action.payload);
    },
    updateTask(state, action: PayloadAction<{ id: string; changes: Partial<TaskItem> }>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload.changes };
    },
    changeStatus(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx].status = action.payload.status;
    },
  },
});

export const { addTask, updateTask, changeStatus } = tasksSlice.actions;
export default tasksSlice.reducer;


