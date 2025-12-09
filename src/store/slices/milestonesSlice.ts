import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Milestone, MilestoneCreate } from '@/types/milestone';

interface MilestonesState {
  items: Milestone[];
  loading: boolean;
  error?: string;
  filter: {
    type?: 'global' | 'local' | 'all';
    projectId?: string;
    status?: string[];
    searchQuery?: string;
  };
  sortBy: 'targetDate' | 'priority' | 'status' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

const initialState: MilestonesState = {
  items: [],
  loading: false,
  filter: {
    type: 'all',
  },
  sortBy: 'targetDate',
  sortOrder: 'asc',
};

const milestonesSlice = createSlice({
  name: 'milestones',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },

    // CRUD операции
    addMilestone(state, action: PayloadAction<Milestone>) {
      state.items.push(action.payload);
    },

    updateMilestone(state, action: PayloadAction<{ id: string; changes: Partial<Milestone> }>) {
      const index = state.items.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes, updatedAt: new Date().toISOString() };
      }
    },

    deleteMilestone(state, action: PayloadAction<string>) {
      state.items = state.items.filter(m => m.id !== action.payload);
    },

    setMilestones(state, action: PayloadAction<Milestone[]>) {
      state.items = action.payload;
    },

    // Фильтрация
    setFilter(state, action: PayloadAction<Partial<MilestonesState['filter']>>) {
      state.filter = { ...state.filter, ...action.payload };
    },

    clearFilters(state) {
      state.filter = {
        type: 'all',
      };
    },

    // Сортировка
    setSorting(state, action: PayloadAction<{ sortBy: MilestonesState['sortBy']; sortOrder: MilestonesState['sortOrder'] }>) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    // Специфические обновления
    updateProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
      const milestone = state.items.find(m => m.id === action.payload.id);
      if (milestone) {
        milestone.progress = action.payload.progress;
        if (action.payload.progress === 100) {
          milestone.status = 'completed';
          milestone.completedAt = new Date().toISOString();
        } else if (action.payload.progress > 0) {
          milestone.status = 'in_progress';
        }
        milestone.updatedAt = new Date().toISOString();
      }
    },

    updateStatus(state, action: PayloadAction<{ id: string; status: Milestone['status'] }>) {
      const milestone = state.items.find(m => m.id === action.payload.id);
      if (milestone) {
        milestone.status = action.payload.status;
        if (action.payload.status === 'completed' && milestone.progress < 100) {
          milestone.progress = 100;
          milestone.completedAt = new Date().toISOString();
        }
        milestone.updatedAt = new Date().toISOString();
      }
    },

    // Проверка просроченных милстоунов
    checkOverdue(state) {
      const now = new Date();
      state.items.forEach(milestone => {
        if (milestone.status !== 'completed' && new Date(milestone.targetDate) < now) {
          milestone.status = 'overdue';
          milestone.updatedAt = new Date().toISOString();
        }
      });
    },
  },
});

export const {
  setLoading,
  setError,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  setMilestones,
  setFilter,
  clearFilters,
  setSorting,
  updateProgress,
  updateStatus,
  checkOverdue,
} = milestonesSlice.actions;

export default milestonesSlice.reducer;