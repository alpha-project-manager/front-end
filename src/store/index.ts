import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
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
import votes from "./slices/votesSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "accessToken", "user"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, auth);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    projects,
    meetings,
    tasks,
    requests,
    history,
    calendar,
    teamProject,
    reports,
    archive,
    votes,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


