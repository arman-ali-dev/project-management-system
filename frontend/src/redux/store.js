import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./member/authSlice";
import userReducer from "./member/userSlice";
import taskReducer from "./member/taskSlice";
import projectReducer from "./member/projectSlice";
import folderReducer from "./member/folderSlice";
import documentReducer from "./member/documentSlice";
import chatSlice from "./member/chatSlice";
import chatRoomSlice from "./member/chatRoomSlice";
import reminderSlice from "./member/reminderSlice";
import notificationSlice from "./member/notificationSlice";

import adminUserReducer from "./admin/userSlice";
import adminProjectReducer from "./admin/projectSlice";
import adminTaskReducer from "./admin/taskSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

// AUTH
const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["loading", "error"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  task: taskReducer,
  project: projectReducer,
  folder: folderReducer,
  document: documentReducer,
  chat: chatSlice,
  chatRoom: chatRoomSlice,
  reminder: reminderSlice,
  notification: notificationSlice,

  // ADMIN
  adminUser: adminUserReducer,
  adminProject: adminProjectReducer,
  adminTask: adminTaskReducer,
});

const rootPersistConfig = {
  key: "pm",
  storage,
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
