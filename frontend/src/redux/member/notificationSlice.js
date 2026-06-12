import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "https://apislack.a2groups.org/api/messages/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("notifications:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed");
    }
  },
);

export const clearNotificationsFromDb = createAsyncThunk(
  "notification/clearNotificationsFromDb",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Deleted All Notifications");
      const token = localStorage.getItem("jwt");

      await axios.delete("https://apislack.a2groups.org/api/messages/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Deleted All Notifications");

      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to clear notifications",
      );
    }
  },
);

const notificationSlice = createSlice({
  name: "notification",

  initialState: {
    notifications: [],
    loading: false,
  },

  reducers: {
    addNotification: (state, action) => {
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id,
      );

      if (!exists) {
        state.notifications.unshift(action.payload);
      }
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
    },

    markAsRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        const backendNotifs = action.payload || [];

        state.notifications = backendNotifs.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title || n.senderName || "Notification",
          body: n.body || n.message || "",
          read: n.read ?? false,
          roomId: n.roomId,
          roomName: n.roomName,
          taskId: n.taskId,
          taskTitle: n.taskTitle,
          profileUrl: n.profileUrl,
          createdAt: n.createdAt,
        }));
      })

      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(clearNotificationsFromDb.fulfilled, (state) => {
        state.notifications = [];
      });
  },
});

export const { addNotification, clearNotifications, markAllRead, markAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
