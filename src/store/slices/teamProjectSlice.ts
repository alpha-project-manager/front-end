import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTeamProjects } from "@/services/teamProject";

interface TeamProjectState {
  items: Array<{ id: string; studentTeam: string; status: string; deadline: string }>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: TeamProjectState = {
  items: [],
  status: "idle",
};

export const loadTeamProjects = createAsyncThunk("teamProject/load", async () => {
  return await getTeamProjects();
});

const teamProjectSlice = createSlice({
  name: "teamProject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTeamProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadTeamProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadTeamProjects.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default teamProjectSlice.reducer;


