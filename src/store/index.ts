import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import projects from "./slices/projectsSlice";
import meetings from "./slices/meetingsSlice";
import tasks from "./slices/tasksSlice";
import requests from "./slices/requestsSlice";
import history from "./slices/historySlice";
import calendar from "./slices/calendarSlice";
import teamProject from "./slices/teamProjectSlice";
import reports from "./slices/reportsSlice";
import archive from "./slices/archiveSlice";

export const store = configureStore({
  reducer: {
    auth,
    projects,
    meetings,
    tasks,
    requests,
    history,
    calendar,
    teamProject,
    reports,
    archive,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


