import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, Credentials } from "@/types/auth";
import { mockLogin, mockLogout } from "@/services/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  status: "idle",
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      const res = await mockLogin(credentials);
      return res;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Ошибка входа");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await mockLogout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.accessToken = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? action.error.message ?? "Ошибка");
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.accessToken = undefined;
        state.user = undefined;
        state.status = "idle";
        state.error = undefined;
      });
  },
});

export default authSlice.reducer;


