import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Project } from "@/types/project";
import { fetchProjects, createProject, updateProject, createProjectAPI, fetchProjectsFromTimpr } from "@/services/projects";

interface ProjectsState {
  items: Project[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: ProjectsState = {
  items: [],
  status: "idle",
};

export const loadProjects = createAsyncThunk("projects/load", async () => {
  const data = await fetchProjects();
  return data;
});

export const addProject = createAsyncThunk("projects/add", async (payload: Omit<Project, "id">) => {
  const created = await createProject(payload);
  return created;
});

export const editProject = createAsyncThunk(
  "projects/edit",
  async ({ id, data }: { id: string; data: Partial<Project> }) => {
    const updated = await updateProject(id, data);
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

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default projectsSlice.reducer;


