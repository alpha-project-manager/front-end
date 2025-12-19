import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Project } from "@/types/project";
import type { ProjectBriefResponse, CreateNewProjectRequest, UpdateProjectRequest, ProjectFullResponse } from "@/types/project";
import { 
  fetchProjects as fetchProjectsOld, 
  createProject as createProjectOld, 
  updateProject as updateProjectOld, 
  createProjectAPI, 
  fetchProjectsFromTimpr,
  fetchProjectsNew,
  fetchProjectNew,
  createProjectNew,
  updateProjectNew
} from "@/services/projects";

interface ProjectsState {
  items: Project[];
  newItems: ProjectBriefResponse[]; // Новые проекты с API
  currentProject: ProjectBriefResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  newStatus: "idle" | "loading" | "succeeded" | "failed";
  newError?: string;
}

const initialState: ProjectsState = {
  items: [],
  newItems: [],
  currentProject: null,
  status: "idle",
  newStatus: "idle",
};

// Legacy thunks (старые функции для обратной совместимости)
export const loadProjects = createAsyncThunk("projects/load", async () => {
  const data = await fetchProjectsOld();
  return data;
});

export const addProject = createAsyncThunk("projects/add", async (payload: Omit<Project, "id">) => {
  const created = await createProjectOld(payload);
  return created;
});

export const editProject = createAsyncThunk(
  "projects/edit",
  async ({ id, data }: { id: string; data: Partial<Project> }) => {
    const updated = await updateProjectOld(id, data);
    return updated;
  }
);

export const createProjectViaAPI = createAsyncThunk(
  "projects/createViaAPI",
  async (payload: Omit<Project, "id">) => {
    const created = await createProjectAPI(payload);
    return created;
  }
);

export const loadProjectsFromTimpr = createAsyncThunk(
  "projects/loadFromTimpr",
  async () => {
    const data = await fetchProjectsFromTimpr();
    return data;
  }
);

// New API thunks
export const loadProjectsNew = createAsyncThunk(
  "projects/loadNew",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProjectsNew();
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки проектов");
    }
  }
);

export const loadProjectNew = createAsyncThunk(
  "projects/loadOneNew",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await fetchProjectNew(id);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка загрузки проекта");
    }
  }
);

export const createProjectNewThunk = createAsyncThunk(
  "projects/createNew",
  async (data: CreateNewProjectRequest, { rejectWithValue }) => {
    try {
      const created = await createProjectNew(data);
      return created;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка создания проекта");
    }
  }
);

export const updateProjectNewThunk = createAsyncThunk(
  "projects/updateNew",
  async ({ id, data }: { id: string; data: UpdateProjectRequest }, { rejectWithValue }) => {
    try {
      const updated = await updateProjectNew(id, data);
      return updated;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка обновления проекта");
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject(state) {
      state.currentProject = null;
      state.newStatus = "idle";
      state.newError = undefined;
    },
    clearProjects(state) {
      state.items = [];
      state.newItems = [];
      state.status = "idle";
      state.newStatus = "idle";
      state.error = undefined;
      state.newError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Legacy reducers
      .addCase(loadProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(createProjectViaAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProjectViaAPI.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createProjectViaAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loadProjectsFromTimpr.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadProjectsFromTimpr.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Добавляем загруженные проекты в список (объединяем с существующими)
        state.items = [...state.items, ...action.payload];
      })
      .addCase(loadProjectsFromTimpr.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // New API reducers
      .addCase(loadProjectsNew.pending, (state) => {
        state.newStatus = "loading";
        state.newError = undefined;
      })
      .addCase(loadProjectsNew.fulfilled, (state, action) => {
        state.newStatus = "succeeded";
        state.newItems = action.payload;
      })
      .addCase(loadProjectsNew.rejected, (state, action) => {
        state.newStatus = "failed";
        state.newError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      .addCase(loadProjectNew.pending, (state) => {
        state.newStatus = "loading";
        state.newError = undefined;
      })
      .addCase(loadProjectNew.fulfilled, (state, action) => {
        state.newStatus = "succeeded";
        state.currentProject = action.payload;
      })
      .addCase(loadProjectNew.rejected, (state, action) => {
        state.newStatus = "failed";
        state.newError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      .addCase(createProjectNewThunk.fulfilled, (state, action) => {
        state.newItems.push(action.payload);
      })
      .addCase(createProjectNewThunk.rejected, (state, action) => {
        state.newError = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      .addCase(updateProjectNewThunk.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        // Update in items list
        const index = state.newItems.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.newItems[index] = {
            id: action.payload.id,
            title: action.payload.title,
            teamTitle: action.payload.teamTitle,
            status: action.payload.status,
            semester: action.payload.semester,
            academicYear: action.payload.academicYear,
            tutor: action.payload.tutor
          };
        }
      })
      .addCase(updateProjectNewThunk.rejected, (state, action) => {
        state.newError = String(action.payload ?? action.error.message ?? "Ошибка");
      });
  },
});

export const { clearCurrentProject, clearProjects } = projectsSlice.actions;
export default projectsSlice.reducer;