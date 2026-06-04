// src/redux/member/notificationSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(
        "https://apislack.a2groups.org/api/messages/notifications",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("notifications: ", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
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
    // ── Real-time notification add karo ───────────────────────────────────────
    addNotification: (state, action) => {
      // Duplicate check — same id already hai toh mat add karo
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id,
      );
      if (!exists) {
        state.notifications.unshift(action.payload); // newest first
      }
    },

    // ── Notification read mark karo ───────────────────────────────────────────
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
        // ── Real-time wali notifications preserve karo ────────────────────────
        // Backend se aaye notifications + already stored real-time notifications merge karo
        const backendNotifs = action.payload || [];
        const realtimeNotifs = state.notifications.filter(
          (n) => n.type === "CHAT" || n.type === "TASK_STATUS",
        );

        // Backend notifications mein jo real-time mein nahi hain woh add karo
        const merged = [...realtimeNotifs];
        backendNotifs.forEach((bn) => {
          const alreadyExists = merged.some((n) => n.id === bn.id);
          if (!alreadyExists) merged.push(bn);
        });

        state.notifications = merged;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addNotification, markAllRead, markAsRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
